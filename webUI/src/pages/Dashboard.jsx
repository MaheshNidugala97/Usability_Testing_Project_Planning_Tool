import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/sideBars/Sidebar.jsx';
import Navbar from '../components/sideBars/NavBar.jsx';
import Backlog from '../components/Backlog/index.jsx';
import Board from '../components/KanbanBoard/Board.jsx';
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
    <div className="Dashboard">
      <Sidebar />
      <div className="main-section">
        <Navbar  onOpenCreateIssue={handleOpenCreateIssue} />
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Navigate to="/board" />} />
            <Route path="/board" element={<Board />} />
            <Route path="/backlog" element={<Backlog />} />
          </Routes>
          {showCreateIssue && <CreateIssue onClose={handleCloseCreateIssue} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

