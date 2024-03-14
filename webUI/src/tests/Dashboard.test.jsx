import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from '../pages/Dashboard';

jest.mock('../components/sideBars/Sidebar.jsx', () => () => <div>Sidebar Mock</div>);
jest.mock('../components/sideBars/NavBar.jsx', () => ({ onOpenCreateIssue }) => <button onClick={onOpenCreateIssue}>Open Create Issue</button>);
jest.mock('../components/Backlog/index.jsx', () => () => <div>Backlog Mock</div>);
jest.mock('../components/KanbanBoard/Board.jsx', () => () => <div> Board</div>);
jest.mock('../components/CreateIssue.jsx', () => ({ onClose }) => <button onClick={onClose}>Close Create Issue</button>);

describe('Dashboard Component', () => {
  it('renders Dashboard and its child components', () => {
    const { getByText } = render(<BrowserRouter><Dashboard /></BrowserRouter>);

    expect(getByText('Sidebar Mock')).toBeInTheDocument();
    expect(getByText('Open Create Issue')).toBeInTheDocument();
    expect(() => getByText('Close Create Issue')).toThrow();
  });

  it('CreateIssue component toggles on button click', async () => {
    const { getByText, queryByText } = render(<BrowserRouter><Dashboard /></BrowserRouter>);

    fireEvent.click(getByText('Open Create Issue'));
    await waitFor(() => expect(getByText('Close Create Issue')).toBeInTheDocument());

    fireEvent.click(getByText('Close Create Issue'));
    await waitFor(() => expect(queryByText('Close Create Issue')).not.toBeInTheDocument());
  });

  it('navigates to Board component as default route', () => {
    const { container } = render(<BrowserRouter><Dashboard /></BrowserRouter>);
    // expect(getByText('Board Mock')).toBeInTheDocument();
    expect(container.innerHTML).toContain('Board');
  });
});
