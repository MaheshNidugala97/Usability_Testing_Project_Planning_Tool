import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '../components/sideBars/Sidebar.jsx';
import Navbar from '../components/sideBars/NavBar.jsx';
import Backlog from '../components/Backlog/index.jsx';
import Board from '../components/KanbanBoard/Board.jsx';
import ProjectSettings from '../components/ProjectSettings.jsx';
import CreateIssue from '../components/CreateIssue.jsx';
import '../styles/Dashboard.css';

function Dashboard() {
  
  const [showCreateIssue, setShowCreateIssue] = useState(false);


  const handleCloseCreateIssue = () => {
    setShowCreateIssue(false);
  };

  const handleOpenCreateIssue = () => {
    setShowCreateIssue(true);
  };

  return (
    <Router>
      <div className="Dashboard">
        <Sidebar />
        <div className="main-section">
          <Navbar onOpenCreateIssue={handleOpenCreateIssue} />
          <div className="main-container">
            <Routes>
              <Route path="/board" element={<Board />} />
              <Route path="/project-settings" element={<ProjectSettings />} />
              <Route path="/backlog" element={<Backlog />} />
              <Route path="/" element={<div>Select a project from the menu</div>} />
            </Routes>
            {showCreateIssue && <CreateIssue onClose={handleCloseCreateIssue} />}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;

