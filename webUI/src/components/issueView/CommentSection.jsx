import React from 'react';
import axios from 'axios';
import '../../styles/issueView/CommentSection.css';



const CommentSection = ({ issueId, comment, setcomment, commentList, setcommentList, setMessage }) => {
  const handlecommentChange = (e) => {
    setcomment(e.target.value);
  };

  const submitcomment = async () => {
    try {
      const response = await axios.post(`http://localhost:3009/api/issues/${issueId}/comment`, {
        comment: comment, 
        
        
      });
    alert(response.data.message); 
      setcommentList([...commentList, comment]);
      setcomment(""); 
      setMessage("comment submitted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setMessage("Error submitting comment");
    }
  };
  


  return (
    <div className="comment-section">
      <h3>comment:</h3>
      <textarea
        value={comment}
        onChange={handlecommentChange}
        placeholder="Enter your comment..."
      ></textarea>
      <button onClick={submitcomment}>Submit comment</button>
      <div className="comment-list">
        {commentList.map((commentItem, index) => (
          <div key={index} className="comment-list-item">
            {commentItem}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
