import React from 'react';
import '../../styles/issueView/IssueHeader.css';

const IssueHeader = ({ onClose, onExpand, isExpanded, time }) => {
  const date = new Date(time);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className={`header-issue ${isExpanded ? 'expanded' : ''}`}>
      <p className="issue-date">{formattedDate}</p>
      <div>
        <button type="button" className="expand-button" onClick={onExpand}>
          {isExpanded ? "Collapse" : "Expand"}
        </button>
        <button type="button" className="issue-close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default IssueHeader;