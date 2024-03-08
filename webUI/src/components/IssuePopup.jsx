import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import "../styles/IssuePopup.css";

const IssuePopup = ({ issueId, onClose }) => {
  const [issue, setIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedColor, setSelectedColor] = useState("#007bff"); // Default color
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0); // Key to reset file input
  const [message, setMessage] = useState(""); // Success message
  const [showDetails, setShowDetails] = useState(false);
  const [comment, setcomment] = useState(""); // comment text
  const [commentList, setcommentList] = useState([]); // List of comment

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueResponse = await axios.get(`http://localhost:3009/api/issues/1796084`);
        setIssue(issueResponse.data);

        const commentResponse = await axios.get(`http://localhost:3009/api/issues/1796084/comment`);
        setcommentList(commentResponse.data);
      } catch (error) {
        console.error("Error fetching issue:", error);
      }
    };

    fetchData();

    return () => {
      setIssue(null);
      setcommentList([]);
    };
  }, [issueId]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setShowColorOptions(false); // Closing the  color options after selection
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setAttachments([...attachments, ...files]);
    setFileInputKey((prevKey) => prevKey + 1); 
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      attachments.forEach((file) => {
        formData.append("files", file);
      });

      // Send formData to server to save files to the specified path
      await axios.post("http://localhost:3009/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handlecommentChange = (e) => {
    setcomment(e.target.value);
  };

  const submitcomment = async () => {
    try {
      await axios.post(`http://localhost:3009/api/issues/1796084/comment`, {
        comment: comment,
      });

      setcommentList([...commentList, comment]);
      setcomment("");
      setMessage("comment submitted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="issue-popup-container">
      <div className="issue-popup">
        <div className="header">
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
          <button type="button" className="expand-button">
            Expand
          </button>
        </div>
        {issue ? (
          <div className="issue-details">
            <div className="title-section">
              <div
                className="color-picker"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorOptions(true)}
              ></div>
              {showColorOptions && (
                <div className="color-options">
                  <div
                    className="color-option"
                    style={{ backgroundColor: "#418553" }}
                    onClick={() => handleColorChange("#418553")}
                  ></div>
                  <div
                    className="color-option"
                    style={{ backgroundColor: "#00ff00" }}
                    onClick={() => handleColorChange("#00ff00")}
                  ></div>
                  <div
                    className="color-option"
                    style={{ backgroundColor: "#0000ff" }}
                    onClick={() => handleColorChange("#0000ff")}
                  ></div>
                  <div
                    className="color-option"
                    style={{ backgroundColor: "#a212e0" }}
                    onClick={() => handleColorChange("#a212e0")}
                  ></div>
                  <div
                    className="color-option"
                    style={{ backgroundColor: "#e0c812" }}
                    onClick={() => handleColorChange("#e0c812")}
                  ></div>
                  <div
                    className="color-option"
                    style={{ backgroundColor: "#e01238" }}
                    onClick={() => handleColorChange("#e01238")}
                  ></div>
                </div>
              )}
              <h2 className="title">{issue.title}</h2>
            </div>
            <div className="attachment-section">
              <label htmlFor="fileInput">Attachments:</label>
              <div className="file-input-section">
                <input
                  key={fileInputKey}
                  type="file"
                  id="fileInput"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput" className="upload-button">
                  <FontAwesomeIcon icon={faPaperclip} />
                </label>
                <button onClick={handleFileUpload}>Upload</button>
              </div>
              {attachments.length > 0 && (
                <div className="attachment-thumbnails">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-thumbnail">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Attachment ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              {message && <p className="upload-message">{message}</p>}
            </div>
            <div className={`status-section ${selectedStatus}`}>
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="description-section">
              <h3>Description:</h3>
              <div className="description-box">
                <p className="description-text">{issue.description}</p>
              </div>
            </div>
            <div className="details-section">
              <button className="details-button" onClick={toggleDetails}>
                Details
              </button>
              {showDetails && (
                <div className="details-content">
                  <div className="issue-detail">
                    <span className="label">Status:</span>
                    <span>{issue.status}</span>
                  </div>
                  <div className="issue-detail">
                    <span className="label">Priority:</span>
                    <span>{issue.priority}</span>
                  </div>
                  <div className="issue-detail">
                    <span className="label">Assignee:</span>
                    <span>{issue.assignee}</span>
                  </div>
                  <div className="issue-detail">
                    <span className="label">Reporter:</span>
                    <span>{issue.reporter}</span>
                  </div>
                </div>
              )}
            </div>
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
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default IssuePopup;
