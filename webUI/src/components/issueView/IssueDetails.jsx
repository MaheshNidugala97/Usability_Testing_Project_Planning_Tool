import React from 'react';
import '../../styles/issueView/IssueDetails.css';



const IssueDetails = ({ issue, selectedStatus, handleStatusChange, toggleDetails, showDetails }) => {
  return (
    <div className="issue-details">
      <div className="title-section">
        <h2 className="title">{issue.title}</h2>
      </div>
      <div className={`status-section ${selectedStatus}`}>
        <label htmlFor="status">Status:</label>
        <select id="status" value={selectedStatus} onChange={handleStatusChange}>
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
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        {showDetails && (
          <div className="details-content">
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
    </div>
  );
};

export default IssueDetails;
