import React, { useState } from 'react';
import axios from 'axios';
import {
  render,
  fireEvent,
  screen,
  renderHook,
  act,
  waitFor,
} from '@testing-library/react';
import AddMemberModal from '../components/KanbanBoard/AddMembers.jsx';
import DeleteTicketModal from '../components/KanbanBoard/DeleteModal.jsx';
import SprintCompleteModal from '../components/KanbanBoard/CompleteSprintModal.jsx';
import Search from '../components/KanbanBoard/Search.jsx';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(), // Mock useNavigate
}));

describe('components/KanbanBoard/AddMemberModal.jsx', () => {
  test('renders properly', () => {
    const handleClose = jest.fn();
    const handleAddMember = jest.fn();
    render(
      <AddMemberModal
        open={true}
        onClose={handleClose}
        onAddMember={handleAddMember}
      />
    );
    expect(screen.getByText('Add People')).toBeInTheDocument();
    const memberNameInput = screen.getByLabelText('Member Name');
    expect(memberNameInput).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const addButton = screen.getByText('Add');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.change(memberNameInput, { target: { value: 'Athul Krishna' } });

    expect(memberNameInput.value).toBe('Athul Krishna');
    const { result } = renderHook(() => {
      const [memberName, setMemberName] = useState('');
      React.useEffect(() => {
        setMemberName(memberNameInput.value);
      }, []);
      return memberName;
    });
    expect(result.current).toBe('Athul Krishna');

    fireEvent.click(addButton);
    expect(handleAddMember).toHaveBeenCalledWith('Athul Krishna');
    expect(handleClose).toHaveBeenCalledTimes(2);
    expect(memberNameInput.value).toBe('');
  });
  test('set state values properly', async () => {
    const handleClose = jest.fn();
    const handleAddMember = jest.fn();
    render(
      <AddMemberModal
        open={true}
        onClose={handleClose}
        onAddMember={handleAddMember}
      />
    );
    const memberNameInput = screen.getByLabelText('Member Name');
    fireEvent.change(memberNameInput, { target: { value: 'Athul Krishna' } });
    const { result: memberInputName } = renderHook(() => {
      const [memberName, setMemberName] = useState('');
      React.useEffect(() => {
        setMemberName(memberNameInput.value);
      }, []);
      return memberName;
    });
    expect(memberInputName.current).toBe('Athul Krishna');
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    expect(handleAddMember).toHaveBeenCalledWith('Athul Krishna');
  });
});

describe('components/KanbanBoard/DeleteTicketModal.jsx', () => {
  test('renders properly', () => {
    const handleClose = jest.fn();
    const handleDeleteTicket = jest.fn();

    render(
      <DeleteTicketModal
        open={true}
        onClose={handleClose}
        onTicketDelete={handleDeleteTicket}
        ticketId='123'
        ticketName='Example Ticket'
      />
    );

    const titleText = screen.getByText(/Delete Ticket Example Ticket/i);
    expect(titleText).toBeInTheDocument();
    const errorIcon = screen.getByTestId('error-icon');
    expect(errorIcon).toBeInTheDocument();

    const confirmationMessage = screen.getByText(
      /You're about to permanently delete this issue/i
    );
    expect(confirmationMessage).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(deleteButton);
    expect(handleDeleteTicket).toHaveBeenCalledWith('123');
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});

describe('components/KanbanBoard/SprintCompleteModal.jsx', () => {
  test('renders properly', async () => {
    const handleSprintComplete = jest.fn();
    const handleClose = jest.fn();

    render(
      <SprintCompleteModal
        open={true}
        onClose={handleClose}
        onSprintComplete={handleSprintComplete}
        sprintName='Example Sprint'
        todoCount={5}
        inProgressCount={3}
        doneCount={2}
      />
    );

    const titleText = screen.getByText(/Complete Example Sprint/i);
    expect(titleText).toBeInTheDocument();

    const todoCount = screen.getByText('5 To Do');
    expect(todoCount).toBeInTheDocument();
    const inProgressCount = screen.getByText('3 In Progress');
    expect(inProgressCount).toBeInTheDocument();
    const doneCount = screen.getByText('2 Done');
    expect(doneCount).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const completeButton = screen.getByText('Complete Sprint');
    expect(completeButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(completeButton);

    expect(handleSprintComplete).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  test('navigates to /backlog on click of Complete Sprint button', () => {
    const mockNavigate = jest.fn();
    const handleClose = jest.fn();
    const handleSprintComplete = jest.fn();

    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate);

    render(
      <SprintCompleteModal
        open={true}
        onClose={handleClose}
        onSprintComplete={handleSprintComplete}
        sprintName='Example Sprint'
        todoCount={5}
        inProgressCount={3}
        doneCount={2}
      />
    );

    fireEvent.click(screen.getByText('Complete Sprint'));

    expect(handleSprintComplete).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith('/backlog');
  });
});

describe('components/KanbanBoard/Search.jsx', () => {
  test('renders Search component', () => {
    render(<Search searchQuery='' setSearchQuery={() => {}} />);
    const searchInput = screen.getByLabelText('Search this board');
    expect(searchInput).toBeInTheDocument();
  });
  test('allows the user to search', async () => {
    let searchQuery = '';
    const setSearchQuery = jest.fn((value) => {
      searchQuery = value;
    });

    render(
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    );
    const searchInput = screen.getByLabelText('Search this board');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await waitFor(() => {
      expect(searchQuery).toBe('test');
    });
  });
  test('ClearIcon sets searchQuery to an empty string', async () => {
    const setSearchQuery = jest.fn();

    render(<Search searchQuery='test' setSearchQuery={setSearchQuery} />);

    const searchBox = screen.getByTestId('search-input');
    fireEvent.change(searchBox, { target: { value: 'test' } });
    expect(searchBox.value).toBe('test');
    let clearIcon = screen.getByTestId('clear-icon');
    expect(clearIcon).toBeVisible();

    fireEvent.click(clearIcon);
    expect(setSearchQuery).toHaveBeenCalledWith('');
  });

  test('Clear Icon should not be visible if text field is empty', async () => {
    const setSearchQuery = jest.fn();
    render(<Search searchQuery='' setSearchQuery={setSearchQuery} />);
    const clearIcon = screen.queryByTestId('clear-icon');
    expect(clearIcon).toBeNull();
  });
});
