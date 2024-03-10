import React from "react";
import "../../styles/issueView/IssueDetails.css";

const IssueDetails = ({
  issue,
  selectedStatus,
  handleStatusChange,
  toggleDetails,
  showDetails,
  isExpanded,
}) => {
  return (
    <div className="issue-details" data-testid="issue-details">
      <div className="title-section">
        <h2 className="title">{issue.title}</h2>
      </div>
      <div className={`status-section ${selectedStatus}`}>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="description-section">
        <h3>Description:</h3>
        <div className="description-box">
          <p className="description-text">{issue.description}</p>
        </div>
      </div>

      {!isExpanded && (
        <div className="details-section">
          <button
            className="details-button"
            onClick={toggleDetails}
            data-testid="show-hide-details-button"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
          {showDetails && (
            <div className="details-content" data-testid="details-content">
              <DetailContent issue={issue} />
            </div>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="details-content">
          <DetailContent issue={issue} />
        </div>
      )}
    </div>
  );
};

const DetailContent = ({ issue }) => (
  <>
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
  </>
);

export default IssueDetails;