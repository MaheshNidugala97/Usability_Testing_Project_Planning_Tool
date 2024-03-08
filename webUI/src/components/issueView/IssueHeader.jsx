import React from 'react';
import '../../styles/issueView/IssueHeader.css';

const IssueHeader = ({ onClose, onExpand }) => (
  <div className="header">
    <button type="button" className="close-button" onClick={onClose}>
      ×
    </button>
    <button type="button" className="expand-button" onClick={onExpand}>
      Expand
    </button>
  </div>
);

export default IssueHeader;
