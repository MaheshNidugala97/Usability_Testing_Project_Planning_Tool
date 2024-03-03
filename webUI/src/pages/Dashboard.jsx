import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/NavBar.jsx/index.js';
import Backlog from '../components/Backlog.jsx';
import Board from '../components/Board.jsx';
import ProjectSettings from '../components/ProjectSettings.jsx';
import CreateIssue from '../components/CreateIssue.jsx';
import '../styles/Dashboard.css';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('Board');

  const handleCloseCreateIssue = () => {
    setActiveSection('Board');
  };

  const getActiveComponent = () => {
    switch (activeSection) {
      case 'Board': return <Board />;
      case 'Project Settings': return <ProjectSettings />;
      case 'Create Issue': return <CreateIssue onClose={handleCloseCreateIssue} />;
      case 'Backlog': return <Backlog />;
      default: return <div>Select a project from the menu</div>;
    }
  };

  return (
    <div className="Dashboard">
      <Sidebar />
      <div className="main-section">
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-container">
          {getActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;