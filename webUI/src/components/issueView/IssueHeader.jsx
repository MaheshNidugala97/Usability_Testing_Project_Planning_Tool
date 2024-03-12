import React from 'react';
import '../../styles/issueView/IssueHeader.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const formatDate = (time) => {
  const date = new Date(time);
  return date.toLocaleDateString('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

const YourComponent = ({ isExpanded, time, onExpand, onClose }) => {
  const formattedDate = formatDate(time);

  return (
    <div className={`header-issue ${isExpanded ? 'expanded' : ''}`}>
      <p className="issue-date smaller-text">{formattedDate}</p>
      <div>
        <Stack spacing={1} direction="row">
          <Button
            className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            onClick={onExpand}
            variant="contained"
            color="primary"
            sx={{
              padding: '8px', 
              borderRadius: '2px', 
              fontSize: '10px', 
            }}
          >
            {isExpanded ? 'Shrink' : 'Expand'}
          </Button>
          <Button
            type="button"
            className="issue-close-button"
            onClick={onClose}
            variant="contained"
            sx={{
              padding: '8px', 
              borderRadius: '2px', 
              fontSize: '10px',
            }}
          >
            ×
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default YourComponent;
