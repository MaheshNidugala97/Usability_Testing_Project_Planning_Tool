import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "../../styles/issueView/CommentSection.css";

const CommentSection = ({ issueId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3009/api/issues/${issueId}/comment`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [issueId]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const submitComment = async () => {
    if (comment.trim() === "") {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a comment',
        icon: 'error',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });
      return;
    }

    try {
      const commentId = Math.floor(Math.random() * 1000) + 1;
      const response = await axios.post(
        `http://localhost:3009/api/issues/${issueId}/comment`,
        {
          comment: { id: commentId, text: comment },
        }
      );
      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });
      setComments([...comments, { id: commentId, text: comment }]);
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:3009/api/issues/${issueId}/comments/${commentId}`
      );
      setComments(comments.filter((comment) => comment.id !== commentId));
      Swal.fire({
        title: 'Success!',
        text: 'Comment deleted successfully',
        icon: 'success',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const editComment = async (commentId, newText) => {
    try {
      await axios.put(
        `http://localhost:3009/api/issues/${issueId}/comments/${commentId}`,
        { text: newText }
      );
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, text: newText };
          }
          return comment;
        })
      );
      setEditMode(null);
      setEditText("");
      Swal.fire({
        title: 'Success!',
        text: 'Comment edited successfully',
        icon: 'success',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });

    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  
return (
  <div className="comment-section" data-testid="comment-section">
    <h3>Comment:</h3>
    <textarea
      value={comment}
      onChange={handleCommentChange}
      placeholder="Enter your comment..."
      data-testid="comment-input"
    ></textarea>
    <button
      className="submit-button"
      onClick={submitComment}
      data-testid="submit-button"
    >
      Submit comment
    </button>
    <div className="comment-list" data-testid="comment-list">
      {comments.map((comment, index) => (
        <div key={index} className="comment-item" data-testid={`comment-item-${comment.id}`}>
          {editMode === comment.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Enter new comment text..."
              data-testid={`edit-input-${comment.id}`}
            />
          ) : (
            <span data-testid={`comment-text-${comment.id}`}>{comment.text}</span>
          )}
          <div className="button-container">
            <button
              className="delete"
              onClick={() => deleteComment(comment.id)}
              data-testid={`delete-button-${comment.id}`}
            >
              Delete
            </button>
            {editMode === comment.id ? (
              <>
                <button
                  className="save"
                  onClick={() => editComment(comment.id, editText)}
                  data-testid={`save-button-${comment.id}`}
                >
                  Save
                </button>
                <button className="cancel" onClick={() => setEditMode(null)} data-testid={`cancel-button-${comment.id}`}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="edit"
                onClick={() => {
                  setEditMode(comment.id);
                  setEditText(comment.text);
                }}
                data-testid={`edit-button-${comment.id}`}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default CommentSection;