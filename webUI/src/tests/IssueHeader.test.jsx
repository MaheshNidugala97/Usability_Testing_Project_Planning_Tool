import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IssueHeader from '../components/issueView/IssueHeader'; 

describe('IssueHeader Component', () => {
  const mockOnExpand = jest.fn();
  const mockOnClose = jest.fn();
 

  it('displays the date and renders correctly when expanded', () => {
    const { getByText } = render(<IssueHeader isExpanded={true} time="2024-03-12T16:38:44.632Z" onExpand={mockOnExpand} onClose={mockOnClose} />);
    const dateElement = getByText('Tuesday, March 12, 2024');
    expect(dateElement).toBeInTheDocument();
    expect(screen.getByText(/shrink/i)).toBeInTheDocument();
    expect(screen.getByText(/×/i)).toBeInTheDocument();
  });


  it('calls onExpand when expand button is clicked', () => {
    render(<IssueHeader isExpanded={false} onExpand={mockOnExpand} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/expand/i));
    expect(mockOnExpand).toHaveBeenCalledTimes(1);
  });

  
  it('calls onClose when close button is clicked', () => {
    render(<IssueHeader isExpanded={false}  onExpand={mockOnExpand} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText(/×/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});