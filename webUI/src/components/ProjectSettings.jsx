import React, { useState } from 'react';
import IssuePopup from './issueView/IssuePopup';
 
const ProjectSettings = () => {
  const [showModal, setShowModal] = useState(false);
 
  const [issueId, setIssueId] = useState('1796084');

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>Create Issue</h2>
      <button onClick={openModal}>Open Modal</button>
      {showModal && <IssuePopup issueId={issueId} onClose={closeModal} />}
    </div>
  );
};

export default ProjectSettings;

