import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/issueView/CommentSection.css';

const CommentSection = ({ issueId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3009/api/issues/${issueId}/comment`);
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
      alert("Please enter a comment before submitting.");
      return;
    }

    try {
      const commentId = Math.floor(Math.random() * 1000) + 1;
      const response = await axios.post(`http://localhost:3009/api/issues/${issueId}/comment`, {
        comment: { id: commentId, text: comment },
      });
      alert(response.data.message);
      setComments([...comments, { id: commentId, text: comment }]);
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3009/api/issues/${issueId}/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
      alert('Comment deleted successfully');
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const editComment = async (commentId, newText) => {
    try {
      await axios.put(`http://localhost:3009/api/issues/${issueId}/comments/${commentId}`, { text: newText });
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, text: newText };
        }
        return comment;
      }));
      setEditMode(null);
      setEditText("");
      alert('Comment edited successfully');
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comment:</h3>
      <textarea
        value={comment}
        onChange={handleCommentChange}
        placeholder="Enter your comment..."
      ></textarea>
      <button className="submit-button" onClick={submitComment}>Submit comment</button>
      <div className="comment-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            {editMode === comment.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter new comment text..."
              />
            ) : (
              <span>{comment.text}</span>
            )}
            <div className="button-container">
              <button className="delete" onClick={() => deleteComment(comment.id)}>Delete</button>
              {editMode === comment.id ? (
                <>
                  <button className="save" onClick={() => editComment(comment.id, editText)}>Save</button>
                  <button className="cancel" onClick={() => setEditMode(null)}>Cancel</button>
                </>
              ) : (
                <button className="edit" onClick={() => {
                  setEditMode(comment.id);
                  setEditText(comment.text);
                }}>Edit</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
