import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="#">
          <img style={{width: '50px', height: '100vh'}} src={logo} alt="logo" />
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <button className="button is-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
