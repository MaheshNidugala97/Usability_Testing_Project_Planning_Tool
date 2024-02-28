import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/NavBar';
import Backlog from './components/Backlog';
import Board from './components/Board';
import ProjectSettings from './components/ProjectSettings';
import CreateIssue from './components/CreateIssue';
import './App.css';


function App() {
  const [activeSection, setActiveSection] = useState('Board');

  const getActiveComponent = () => {
    switch (activeSection) {
      case 'Board': return <Board />;
      case 'Project Settings': return <ProjectSettings />;
      case 'Create Issue': return <CreateIssue />;
      case 'Backlog': return <Backlog />;
      default: return <div>Select a project from the menu</div>;
    }
  };

  return (
    <div className="app">
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

export default App;