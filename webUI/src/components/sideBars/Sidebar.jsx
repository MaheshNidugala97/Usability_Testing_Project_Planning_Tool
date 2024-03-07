import React from 'react';
import logo from '../../Assets/logo.png';
import userProfile from '../../Assets/user-profile.png';
import logoutIcon from '../../Assets/logout-icon.png';

function Sidebar() {
  return (
    <div className="sidebar">
      <img src={logo} alt="Logo" className="sidebar-logo" />
      <div className="sidebar-footer">
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
        <img src={userProfile} alt="User" className="sidebar-icon" />
      </div>
    </div>
  );
}

export default Sidebar;