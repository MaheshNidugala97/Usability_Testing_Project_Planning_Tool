import React from 'react';
import projectIcon from '../Assets/project-image.png';
import boardIcon from '../Assets/board-icon.png';
import settingsIcon from '../Assets/settings-icon.png';
import createIcon from '../Assets/create-icon.png';
import BacklogIcon from '../Assets/backlog-icon.png';

function Navbar({ activeSection, setActiveSection }) {
    const menuItems = [
      { title: 'Board', icon: boardIcon },
      { title: 'Backlog', icon: BacklogIcon },
      { title: 'Project Settings', icon: settingsIcon },
      { title: 'Create Issue', icon: createIcon }
      

    ];
  
    return (
      <div className="navbar">
        <div className="project-details">
          <img src={projectIcon} alt="Project" className="project-icon" />
          <h1 className="project-title">Project Test</h1>
          <p className="project-description">Development Project</p>
        </div>
        {menuItems.map((item) => (
          <button
            key={item.title}
            className={`menu-item ${activeSection === item.title ? 'active' : ''}`}
            onClick={() => setActiveSection(item.title)}
          >
            <img src={item.icon} alt={item.title} className="menu-icon" />
            {item.title}
          </button>
        ))}
      </div>
    );
  }
  
  export default Navbar;