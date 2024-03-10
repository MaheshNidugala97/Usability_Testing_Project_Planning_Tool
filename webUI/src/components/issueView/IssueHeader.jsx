import React from 'react';
import '../../styles/issueView/IssueHeader.css';

const IssueHeader = ({ onClose, onExpand, isExpanded }) => (
  <div className={`header-issue ${isExpanded ? 'expanded' : ''}`}>
    <button type="button" className="issue-close-button" onClick={onClose}>
      ×
    </button>
    <button type="button" className="expand-button" onClick={onExpand}>
      {isExpanded ? "Collapse" : "Expand"}
    </button>
  </div>
);

export default IssueHeader;
