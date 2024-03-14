import React from 'react';
import axios from 'axios';
import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from '@testing-library/react';
import Backlog from '../components/Backlog/index.jsx';

jest.mock('axios');

const mockData = [{
    "id": 9542689,
    "ticketName": "T-3",
    "title": "Login page",
    "description": "design login page with 2 fields",
    "status": "In Progress",
    "priority": "HIGH",
    "assignee": "Athul Krishna",
    "reporter": "John",
    "estimate": "3",
    "time": "2024-03-12T16:38:44.632Z",
    "completedInPreviousSprint": false,
    "comment": []
  }]

describe('components/Backlog/index.jsx', () => {
  test('renders properly', async () => {
    
    axios.get.mockResolvedValue({
      data: [{"id":1,"sprintName":"Sprint 1","startDate":"2024-03-18","endDate":"2024-03-19"}],
    });
    //axios.mockResolvedValueOnce({ data: mockData });

    render(<Backlog />);
    
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Test Here' } });
    expect(screen.getByPlaceholderText('Search').value).toBe( 'Test Here' );

   
  });

});
