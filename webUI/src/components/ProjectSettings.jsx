// import React from 'react';

// const ProjectSettings = () => {
//   return <div>Project Settings Content</div>;
// };

// export default ProjectSettings;



// CreateIssue.js
import React, { useState } from 'react';
import IssuePopup from './IssuePopup';

const ProjectSettings = () => {
  const [showModal, setShowModal] = useState(false);

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
      {showModal && <IssuePopup onClose={closeModal} />}
      {/* Your form inputs or UI elements for creating issues */}
    </div>
  );
};

export default ProjectSettings;
