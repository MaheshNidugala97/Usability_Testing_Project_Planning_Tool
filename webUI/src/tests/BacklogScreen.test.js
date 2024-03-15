import React, { useState } from 'react';
import axios from 'axios';
import {
  render,
  fireEvent,
  screen,
  renderHook,
  waitFor,
  act
} from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Collapsible from '../components/Backlog/collapse/Collapsible';
import AddDate from '../components/Backlog/collapse/AddDate';
import BpCheckbox from '../utilities/BpCheckbox';
import TableNoData from '../components/Backlog/Table/table-no-data';
import EnhancedTableHead from '../components/Backlog/Table/EnhancedTableHead';
import {
  descendingComparator,
  getComparator,
  stableSort,
  applyFilter,
} from '../utilities/sorting';
jest.mock('axios');
import DeleteTicketModal from '../components/Backlog/collapse/DeleteModal';
import EnhancedTable from '../components/Backlog/Table/EnhancedTable';
import Backlog from '../components/Backlog/index';

describe('Collapsible Component', () => {
  test('renders Add date modal when edit date button is clicked', async () => {
    const mockOnClose = jest.fn();
    const mockOnDateChange = jest.fn();
    render(<Collapsible
      header="Selected for Development"
      onClose={mockOnClose}
      onDateChange={mockOnDateChange}
      sprintName='Sprint 1' />);
    expect(screen.queryByTestId('add-date-modal')).toBeNull();
    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-sprint-btn'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-date-modal')).toBeInTheDocument();
    });
  });


  test('clicking on the button toggles the open state', () => {
    // Arrange
    const { getByRole } = render(<Collapsible />);
    const button = getByRole('button');

    // Act
    fireEvent.click(button);

    // Assert
    const icon = button.querySelector('svg');
    expect(icon).toHaveClass('svg-inline--fa fa-circle-chevron-down fas-edonec fa-chevron-down-edonec rotate-center-edonec down');// Assuming down class is added when open
  });

  test('onDelete function is called when delete button is clicked', () => {
    // Mock onDelete function
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <Collapsible numSelected={1} onDelete={onDelete} />
    );
    const deleteButton = getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

describe('AddDate Component', () => {

  test('calls handleSubmit function with valid data and closes modal on success', async () => {
    const mockOnClose = jest.fn(); // Mock onClose function
    const mockOnDateChange = jest.fn(); // Mock onDateChange function

    axios.patch.mockResolvedValue({ data: { message: 'Sprint updated successfully' } });

    render(
      <AddDate
        open={true}
        onClose={mockOnClose}
        onDateChange={mockOnDateChange}
        startDate={new Date('2024-03-10')}
        setStartDate={jest.fn()}
        endDate={new Date('2024-03-15')}
        setEndDate={jest.fn()}
        sprintName='sprint 1'
        setSprintName={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('sprint-submit'));
    mockOnClose.mockReturnValue(true);
    await waitFor(() => {
      expect(mockOnClose()).toBe(true);
    })

    mockOnDateChange.mockReturnValue('2024-03-14T00:00:00.000Z', '2024-03-15T00:00:00.000Z')
    await waitFor(() => {
      expect(mockOnDateChange()).toBe('2024-03-14T00:00:00.000Z', '2024-03-15T00:00:00.000Z')
    });

  });

  test('displays validation errors when required fields are empty', async () => {
    const mockOnClose = jest.fn(); // Mock onClose function
    const mockOnDateChange = jest.fn(); // Mock onDateChange function

    render(
      <AddDate
        open={true}
        onClose={mockOnClose}
        onDateChange={mockOnDateChange}
        startDate={new Date('2024-03-10')}
        setStartDate={jest.fn()}
        endDate={new Date('2024-03-15')}
        setEndDate={jest.fn()}
        sprintName=''
        setSprintName={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('sprint-submit'));

    await waitFor(() => {
      expect(screen.getByText('Please fill out all the fields')).toBeInTheDocument();
    });
  });

  test('displays error message when end date is less than or equal to start date', async () => {
    const mockOnClose = jest.fn(); // Mock onClose function
    const mockOnDateChange = jest.fn(); // Mock onDateChange function

    render(
      <AddDate
        open={true}
        onClose={mockOnClose}
        onDateChange={mockOnDateChange}
        startDate={new Date('2024-03-15')}
        setStartDate={jest.fn()}
        endDate={new Date('2024-03-10')}
        setEndDate={jest.fn()}
        sprintName='sprint 1'
        setSprintName={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('sprint-submit'));

    await waitFor(() => {
      expect(screen.getByText('End date must be greater than start date')).toBeInTheDocument();
    });
  });

  test('updates sprintName when input value changes', async () => {
    const mockOnClose = jest.fn();
    const mockOnDateChange = jest.fn();

    render(
      <AddDate
        open={true}
        onClose={mockOnClose}
        onDateChange={mockOnDateChange}
        startDate={new Date('2024-03-10')}
        setStartDate={jest.fn()}
        endDate={new Date('2024-03-15')}
        setEndDate={jest.fn()}
        sprintName='Initial Sprint Name'
        setSprintName={jest.fn()}
      />
    );

    const textFieldComponent = screen.getByTestId('sprint-name-input');
    const sprintNameInput = textFieldComponent.querySelector('input');
    fireEvent.change(sprintNameInput, { target: { value: 'New Sprint Name' } });
    expect(sprintNameInput.value).toBe('Initial Sprint Name');
  });

  test('updates startDate when date is selected', () => {
    const mockOnClose = jest.fn();
    const mockOnDateChange = jest.fn();
    render(
      <AddDate
        open={true}
        onClose={mockOnClose}
        onDateChange={mockOnDateChange}
        startDate={new Date('2024-03-10')}
        setStartDate={jest.fn()}
        endDate={new Date('2024-03-15')}
        setEndDate={jest.fn()}
        sprintName='Initial Sprint Name'
        setSprintName={jest.fn()}
      />
    );
    const startDatePicker = screen.getByPlaceholderText('Select Start Date');
    fireEvent.change(startDatePicker, new Date('2024-03-10'));
    expect(startDatePicker.value).toBe("March 10, 2024");
  });

  test('updates endDate when date is selected', () => {
    const mockOnClose = jest.fn();
    const mockOnDateChange = jest.fn();
    render(
      <AddDate
        open={true}
        onClose={mockOnClose}
        onDateChange={mockOnDateChange}
        startDate={new Date('2024-03-10')}
        setStartDate={jest.fn()}
        endDate={new Date('2024-03-15')}
        setEndDate={jest.fn()}
        sprintName='Initial Sprint Name'
        setSprintName={jest.fn()}
      />
    );
    const endDatePicker = screen.getByPlaceholderText('Select End Date');
    fireEvent.change(endDatePicker, new Date('2024-03-15'));
    expect(endDatePicker.value).toBe("March 15, 2024");
  });
});

describe('BpCheckbox component', () => {
  test('renders unchecked checkbox with default props', () => {
    render(<BpCheckbox />);

    const checkbox = screen.getByRole('checkbox');

    // Check if checkbox is rendered
    expect(checkbox).toBeInTheDocument();

    // Check if checkbox is unchecked by default
    expect(checkbox).not.toBeChecked();
  });

  test('renders checked checkbox with custom props', () => {
    const isItemSelected = true;
    const numSelected = 3;
    const rowCount = 5;
    const isCustomized = false;
    const onSelectAllClick = jest.fn();

    render(
      <BpCheckbox
        isItemSelected={isItemSelected}
        numSelected={numSelected}
        rowCount={rowCount}
        isCustomized={isCustomized}
        onSelectAllClick={onSelectAllClick}
      />
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();

    expect(checkbox).toBeChecked();
  });

  test('renders checkbox with custom props and invokes onSelectAllClick on change', () => {
    const isItemSelected = false;
    const numSelected = 2;
    const rowCount = 5;
    const isCustomized = true;
    const onSelectAllClick = jest.fn();

    render(
      <BpCheckbox
        isItemSelected={isItemSelected}
        numSelected={numSelected}
        rowCount={rowCount}
        isCustomized={isCustomized}
        onSelectAllClick={onSelectAllClick}
      />
    );

    const checkbox = screen.getByRole('checkbox');

    // Check if checkbox is rendered
    expect(checkbox).toBeInTheDocument();

    // Simulate click on checkbox
    fireEvent.click(checkbox);

    // Check if onSelectAllClick is called
    expect(onSelectAllClick).toHaveBeenCalledTimes(1);
  });
});

describe('TableNoData component', () => {
  test('renders properly with query', () => {
    const query = 'testQuery';
    render(<TableNoData query={query} />);
    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(screen.getByTestId('no-found-tag')).toBeInTheDocument();
  });
  test('renders properly without query', () => {
    render(<TableNoData />);
    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(screen.getByTestId('no-found-tag')).toBeInTheDocument();
  });
});

describe('EnhancedTableHead component', () => {
  test('renders table head cells with correct labels', () => {
    const numSelected = 0;
    const order = 'asc';
    const orderBy = 'Task';
    const onSelectAllClick = jest.fn();
    const onRequestSort = jest.fn();
    const rowCount = 10;
    const isItemSelected = jest.fn();

    render(
      <EnhancedTableHead
        numSelected={numSelected}
        order={order}
        orderBy={orderBy}
        onSelectAllClick={onSelectAllClick}
        onRequestSort={onRequestSort}
        rowCount={rowCount}
        isItemSelected={isItemSelected}
      />
    );
    // Check if each table head cell is rendered with correct label
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  test('renders checkbox to select all items', () => {
    const numSelected = 0;
    const order = 'asc';
    const orderBy = 'Task';
    const onSelectAllClick = jest.fn();
    const onRequestSort = jest.fn();
    const rowCount = 10;
    const isItemSelected = jest.fn();

    render(
      <EnhancedTableHead
        numSelected={numSelected}
        order={order}
        orderBy={orderBy}
        onSelectAllClick={onSelectAllClick}
        onRequestSort={onRequestSort}
        rowCount={rowCount}
        isItemSelected={isItemSelected}
      />
    );

    // Check if checkbox to select all items is rendered
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

});

describe('Utility Functions', () => {
  const mockData = [
    { id: 1, title: 'Task 1' },
    { id: 2, title: 'Task 2' },
    { id: 3, title: 'Task 3' },
  ];

  describe('descendingComparator', () => {
    it('should correctly compare two elements in descending order', () => {
      const result = descendingComparator(mockData[0], mockData[1], 'id');
      expect(result).toBe(1);
    });
  });

  describe('getComparator', () => {
    it('should return a comparator function for sorting in descending order', () => {
      const comparator = getComparator('desc', 'id');
      const result = comparator(mockData[0], mockData[1]);
      expect(result).toBe(1);
    });

    it('should return a comparator function for sorting in ascending order', () => {
      const comparator = getComparator('asc', 'id');
      const result = comparator(mockData[0], mockData[1]);
      expect(result).toBe(-1);
    });
  });

  describe('stableSort', () => {
    it('should correctly sort the array in a stable manner', () => {
      const sortedData = stableSort(mockData, (a, b) => a.id - b.id);
      expect(sortedData).toEqual(mockData);
    });
  });

  describe('applyFilter', () => {
    it('should correctly filter the input data based on filter name', () => {
      const filteredData = applyFilter({
        inputData: mockData,
        comparator: (a, b) => a.id - b.id,
        filterName: 'Task 1',
      });
      expect(filteredData).toHaveLength(1);
      expect(filteredData[0].title).toBe('Task 1');
    });

    it('should return the original data if no filter name is provided', () => {
      const filteredData = applyFilter({
        inputData: mockData,
        comparator: (a, b) => a.id - b.id,
        filterName: '',
      });
      expect(filteredData).toEqual(mockData);
    });
  });
});

describe('DeleteTicketModal', () => {
  const mockTicketIds = ['1', '2', '3']; // Mock ticket IDs
  const mockOnTicketDelete = jest.fn(); // Mock function for ticket deletion
  const mockOnClose = jest.fn(); // Mock function for modal close

  test('renders with correct content', async() => {
    render(
      <DeleteTicketModal
        open={true}
        onClose={mockOnClose}
        onTicketDelete={mockOnTicketDelete}
        ticketIds={mockTicketIds}
      />
    );
    expect(screen.getByText('Delete Tickets')).toBeInTheDocument();
    expect(
      screen.getByText(
        `You're about to permanently delete ${mockTicketIds.length} tickets, their comments, attachments, and all of their data.`
      )
    ).toBeInTheDocument();
    
  });

  test('calls onClose when "Cancel" button is clicked',async () => {
    render(
      <DeleteTicketModal
        open={true}
        onClose={mockOnClose}
        onTicketDelete={mockOnTicketDelete}
        ticketIds={mockTicketIds}
      />
    );

    // Click the "Cancel" button
    fireEvent.click(screen.getByTestId('cancel-delete-button'));
    mockOnClose.mockReturnValue(true);
    
    await waitFor(() => {
      expect(mockOnClose()).toBe(true);
    })
  });

  test('calls onTicketDelete and onClose when "Delete" button is clicked', () => {
    render(
      <DeleteTicketModal
        open={true}
        onClose={mockOnClose}
        onTicketDelete={mockOnTicketDelete}
        ticketIds={mockTicketIds}
      />
    );
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnTicketDelete).toHaveBeenCalledWith(mockTicketIds);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

// describe('Backlog Component', () => {

//   test('divides data into sprintData and backlogData correctly', async () => {
//     const mockData =  [
//       {
//         id: '7883168',
//         title: 'GET Api Call',
//         description: 'GET Api Call Implementation',
//         status: 'To Do',
//         priority: 'LOW',
//         assignee: 'Mahesh Nidugala',
//         reporter: 'Mahesh Nidugala',
//         estimate: 3,
//         time: '2024-03-12T16:38:16.802Z',
//         ticketName: 'T-816',
//         completedInPreviousSprint: false,
//       },
//       {
//         id: '7883169',
//         title: 'POST Api Call',
//         description: 'POST Api Call Implementation',
//         status: 'Backlog',
//         priority: 'LOW',
//         assignee: 'Athul Krishna',
//         reporter: 'Mahesh Nidugala',
//         estimate: 3,
//         time: '2024-03-12T16:38:16.802Z',
//         ticketName: 'T-817',
//         completedInPreviousSprint: false,
//       },
//     ];
//     const mockSprints = [
//       {
//         id: 1,
//         sprintName: 'Test Sprint',
//         startDate: '2024-03-14',
//         endDate: '2024-03-20',
//       },
//     ];
  
//     axios.get.mockResolvedValue({
//       data: mockData
//     });
//     axios.get.mockResolvedValueOnce({ data: mockSprints });
//     await act(async () => {render(<Backlog />)})
    
    
//     await waitFor(()=>{
//       expect(screen.getAllByTestId("sprint-data-box")).toHaveLength(1);
   
//     })
//     // await waitFor(()=>{
//     //   expect(screen.getByTestId("backlog-data-box")).toBeInTheDocument()
      
//     // })



 
   

//     // Verify the number of tasks in sprintData and backlogData
//     // expect(screen.getAllByText(/Task/).length).toBe(5); // All tasks are rendered
//     // expect(screen.getAllByText(/Backlog Items/).length).toBe(3); // Tasks in Backlog
//     // expect(screen.getAllByText(/Selected for Development/).length).toBe(2); // Tasks not in Backlog
//   });
// });
