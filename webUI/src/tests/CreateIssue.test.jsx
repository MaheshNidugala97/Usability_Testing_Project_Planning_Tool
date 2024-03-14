import React from 'react';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CreateIssue from '../components/CreateIssue';
import Swal from 'sweetalert2';


jest.mock('axios');
jest.mock('sweetalert2');

const mockOnClose = jest.fn();
const mockResponse = { data: { message: 'Issue created successfully' } };

describe('CreateIssue Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: [{ id: 1, name: 'Alan K Mathew' }] });
  });

  it('renders correctly', () => {
    const { getByText } = render(<CreateIssue onClose={mockOnClose} />);
    expect(screen.getByText('Create new issue')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write the title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter estimate')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a description')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Assignee')).toBeInTheDocument();
    expect(screen.getByText('Reporter')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();

  });


  it('calls the members API on mount', async () => {
    const data = { data: [{ id: 1, name: 'Alan K Mathew' }] };
    axios.get.mockResolvedValue(data);

    render(<CreateIssue onClose={() => {}} />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3009/api/members');
    });
  });



  it('handles input change', () => {
    const { getByPlaceholderText } = render(<CreateIssue onClose={mockOnClose} />);
    const titleInput = getByPlaceholderText('Write the title');
    fireEvent.change(titleInput, { target: { value: 'New Issue Title' } });
    expect(titleInput.value).toBe('New Issue Title');

    const estimateInput = screen.getByPlaceholderText('Enter estimate');
    fireEvent.change(estimateInput, { target: { value: '5' } });
    expect(estimateInput.value).toBe('5');

    
    const descriptionInput = screen.getByPlaceholderText('Add a description');
    fireEvent.change(descriptionInput, { target: { value: 'New Issue Description' } });
    expect(descriptionInput.value).toBe('New Issue Description');

  });


  

  it('calls onClose after successful form submission', async () => {
    axios.post.mockResolvedValue(mockResponse);
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    const { getByText, getByPlaceholderText } = render(<CreateIssue onClose={mockOnClose} />);
    fireEvent.change(screen.getByPlaceholderText('Write the title'), { target: { value: 'Test Issue' } });
    fireEvent.click(screen.getByText('Accept'));

    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it('API errors are handled succesfully', async () => {
    axios.post.mockRejectedValue(new Error('API Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<CreateIssue onClose={mockOnClose} />);
    fireEvent.change(screen.getByPlaceholderText('Write the title'), { target: { value: 'Test Issue' } });
    fireEvent.click(screen.getByText('Accept'));

    await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith('There was an error creating the issue:', expect.any(Error)));

    consoleErrorSpy.mockRestore();

    }); 
    it('handles form submission error', async () => {
        axios.post.mockRejectedValue(new Error('API Error'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
        const { getByText, getByPlaceholderText } = render(<CreateIssue onClose={mockOnClose} />);
        fireEvent.change(getByPlaceholderText('Write the title'), { target: { value: 'Test Issue' } });
        fireEvent.click(getByText('Accept'));
      
        await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith('There was an error creating the issue:', expect.any(Error)));
      
        consoleErrorSpy.mockRestore();
      });

      it('handles form submission', async () => {
        const mockIssue = {
          title: 'Test Issue',
          description: 'Test Description',
          status: 'Backlog',
          priority: 'LOW',
          estimate: '1',
          assignee: 'Alan K Mathew',
          reporter: 'Alan K Mathew',
        };
      
        axios.post.mockResolvedValue({ data: { message: 'Issue created successfully' } });
        Swal.fire.mockResolvedValue({ isConfirmed: true });
      
        const { getByText, getByPlaceholderText } = render(<CreateIssue onClose={mockOnClose} />);
        fireEvent.change(getByPlaceholderText('Write the title'), { target: { value: mockIssue.title } });
        fireEvent.change(getByPlaceholderText('Enter estimate'), { target: { value: mockIssue.estimate } });
        fireEvent.change(getByPlaceholderText('Add a description'), { target: { value: mockIssue.description } });
        fireEvent.click(getByText('Accept'));
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledWith('http://localhost:3009/api/issues', expect.any(Object));
          expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success!' }));
          expect(mockOnClose).toHaveBeenCalled();
        });
      
    });


    test('check list box  value change', async () => {
        const { getByLabelText, getByRole } = render(<CreateIssue />);
      
        const statusSelect = getByLabelText('Status');
        fireEvent.mouseDown(statusSelect);
        let listbox = within(await waitFor(() => getByRole('listbox')));
        fireEvent.click(listbox.getByText(/To Do/i));
        expect(getByRole('button', { name: /Status/i }).textContent).toBe('To Do');
      
        const prioritySelect = getByLabelText('Priority');
        fireEvent.mouseDown(prioritySelect);
        listbox = within(await waitFor(() => getByRole('listbox')));
        fireEvent.click(listbox.getByText(/HIGH/i));
        expect(getByRole('button', { name: /Priority/i }).textContent).toBe('HIGH');
      });


});


