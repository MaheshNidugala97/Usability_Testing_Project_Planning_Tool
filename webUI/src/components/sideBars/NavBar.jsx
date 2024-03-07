
import React from 'react';
import { NavLink } from 'react-router-dom';
import projectIcon from '../../Assets/project-image.png';
import boardIcon from '../../Assets/board-icon.png';
import settingsIcon from '../../Assets/settings-icon.png';
import createIcon from '../../Assets/create-icon.png';
import BacklogIcon from '../../Assets/backlog-icon.png';
import '../../styles/Navbar.css'; 


function Navbar({ onOpenCreateIssue }) {
  const menuItems = [
    { title: 'Board', icon: boardIcon, path: '/board' },
    { title: 'Backlog', icon: BacklogIcon, path: '/backlog' },
    { title: 'Project Settings', icon: settingsIcon, path: '/project-settings' },
  ];

  return (
    <div className="navbar">
      <div className="project-details">
        <img src={projectIcon} alt="Project" className="project-icon" />
        <h1 className="project-title">Project Test</h1>
        <p className="project-description">Development Project</p>
      </div>
      {menuItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.path}
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <img src={item.icon} alt={item.title} className="menu-icon" />
          {item.title}
        </NavLink>
      ))}
      <button className="menu-item create-issue-button" onClick={onOpenCreateIssue}>
        <img src={createIcon} alt="Create Issue" className="menu-icon" />
        Create Issue
      </button>
    </div>
  );
}

export default Navbar;
