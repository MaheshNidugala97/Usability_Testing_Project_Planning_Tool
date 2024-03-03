import React, { useState } from 'react';

const Modal = ({ onClose }) => {
  const [fetchedIssue, setFetchedIssue] = useState(null);

  const fetchIssue = async () => {
    try {
      const response = await fetch('http://your-mock-server-url/issue');
      const data = await response.json();
      setFetchedIssue(data);
    } catch (error) {
      console.error('Error fetching issue:', error);
    }
  };

  const handleButtonClick = () => {
    fetchIssue();
  };

  return (
    <div className="modal" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '300px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>
      <div style={{ padding: '20px' }}>
        <h2>View Issue</h2>
        <button onClick={handleButtonClick}>Fetch Issue</button>
        {fetchedIssue ? (
          <div>
            <h3>{fetchedIssue.title}</h3>
            <p>{fetchedIssue.description}</p>
          </div>
        ) : (
          <p>No issue fetched yet.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;

