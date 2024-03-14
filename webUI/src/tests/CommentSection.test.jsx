import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import CommentSection from '../components/issueView/CommentSection'; 

jest.mock('axios');
jest.mock('sweetalert2');

describe('CommentSection', () => {
  const issueId = '1234567';
  const mockComments = [
    { id: 1, text: 'Test Comment 1' },
    { id: 2, text: 'Test Comment 2' }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockComments });
    axios.post.mockImplementation(() => Promise.resolve({ data: { message: 'Comment added successfully' } }));
    axios.delete.mockImplementation(() => Promise.resolve());
    axios.put.mockImplementation(() => Promise.resolve());
    Swal.fire.mockImplementation(() => Promise.resolve({ isConfirmed: true }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load and display initial comments', async () => {
    render(<CommentSection issueId={issueId} />);

    await waitFor(() => {
      mockComments.forEach(comment => {
        expect(screen.getByTestId(`comment-text-${comment.id}`)).toBeInTheDocument();
      });
    });
  });

  it('should allow entering a comment', () => {
    render(<CommentSection issueId={issueId} />);

    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'New comment' } });
    expect(screen.getByTestId('comment-input')).toHaveValue('New comment');
  });

  it('should submit a new comment successfully', async () => {
    const newComment = 'This is a new comment';
    const mockCommentResponse = { data: { message: 'Comment added successfully' } };
  
    axios.post.mockResolvedValue(mockCommentResponse);
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  
    render(<CommentSection issueId={issueId} />);
  

    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: newComment } });
  

    fireEvent.click(screen.getByTestId('submit-button'));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:3009/api/issues/${issueId}/comment`,
        {
          comment: expect.objectContaining({ text: newComment }),
        }
      );
    });
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success!' }));
    });
  });

  it('should delete a comments', async () => {
    render(<CommentSection issueId={issueId} />);
  
    const deleteButtons = await screen.findAllByTestId(`delete-button-${mockComments[0].id}`);
    fireEvent.click(deleteButtons[0]);
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success!' }));
    });
  
    await waitFor(() => {
      expect(screen.queryByTestId(`comment-text-${mockComments[0].id}`)).not.toBeInTheDocument();
    });
  });

  it('should edit a comment', async () => {
    render(<CommentSection issueId={issueId} />);
  
    const editButtons = await screen.findAllByTestId(`edit-button-${mockComments[0].id}`);
    fireEvent.click(editButtons[0]);
  
    const commentInput = await screen.findByTestId(`edit-input-${mockComments[0].id}`);
    fireEvent.change(commentInput, { target: { value: 'Edited comment' } });
  
    const saveButton = await screen.findByTestId(`save-button-${mockComments[0].id}`);
    fireEvent.click(saveButton);
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success!' }));
    });
  
    await waitFor(() => {
      expect(screen.getByText('Edited comment')).toBeInTheDocument();
    });
  });

  describe('Error handling tests', () => {
    const issueId = '1234567';

    it('should handle errors when fetching comments fails', async () => {
      axios.get.mockRejectedValue(new Error('Error fetching comments'));
      console.error = jest.fn();

      render(<CommentSection issueId={issueId} />);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error fetching comments:', expect.any(Error));
      });
    });

    it('should handle errors when submitting a comment fails', async () => {
      axios.post.mockRejectedValue(new Error('Error submitting comment'));
      console.error = jest.fn();

      render(<CommentSection issueId={issueId} />);
      fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'New comment' } });
      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error submitting comment:', expect.any(Error));
      });
    });

    it('should handle errors when deleting a comment fails', async () => {
      axios.delete.mockRejectedValue(new Error('Error deleting comment'));
      console.error = jest.fn();

      render(<CommentSection issueId={issueId} />);
      const deleteButtons = await screen.findAllByTestId(`delete-button-${mockComments[0].id}`);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error deleting comment:', expect.any(Error));
      });
    });

    it('should handle errors when editing a comment fails', async () => {
      axios.put.mockRejectedValue(new Error('Error editing comment'));
      console.error = jest.fn();

      render(<CommentSection issueId={issueId} />);
      const editButtons = await screen.findAllByTestId(`edit-button-${mockComments[0].id}`);
      fireEvent.click(editButtons[0]);
      const commentInput = await screen.findByTestId(`edit-input-${mockComments[0].id}`);
      fireEvent.change(commentInput, { target: { value: 'Edited comment' } });
      const saveButton = await screen.findByTestId(`save-button-${mockComments[0].id}`);
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error editing comment:', expect.any(Error));
      });
    });

    it('should cancel editing a comment', async () => {
      render(<CommentSection issueId={issueId} />);
      const editButtons = await screen.findAllByTestId(`edit-button-${mockComments[0].id}`);
      fireEvent.click(editButtons[0]);
      const commentInput = await screen.findByTestId(`edit-input-${mockComments[0].id}`);
      fireEvent.change(commentInput, { target: { value: 'Edited comment' } });
      const cancelButton = await screen.findByTestId(`cancel-button-${mockComments[0].id}`);
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId(`edit-input-${mockComments[0].id}`)).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId(`comment-text-${mockComments[0].id}`)).toBeInTheDocument();
      });
    });

    it('should not submit an empty comment', async () => {
      render(<CommentSection issueId={issueId} />);
      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Error!' }));
      });
    });
  });
});


