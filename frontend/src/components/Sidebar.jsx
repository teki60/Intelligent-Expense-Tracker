import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { LayoutDashboard, PlusCircle, LogOut, Moon, Sun } from 'lucide-react';

export const Sidebar = () => {
  const { logout, toggleTheme, theme } = useContext(GlobalContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo-area">
        <h2>ProTracker</h2>
      </div>

      <div className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/add" className={`nav-item ${isActive('/add')}`}>
          <PlusCircle size={20} />
          <span>Add Expense</span>
        </Link>
      </div>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="nav-item theme-btn">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
        </button>
        <button onClick={handleLogout} className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};