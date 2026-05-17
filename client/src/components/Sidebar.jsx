import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  StickyNote,
  Network,
  Search,
  Info,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { logout } from '../lib/auth';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { to: '/app', icon: StickyNote, label: 'Notes', end: true },
  { to: '/app/graph', icon: Network, label: 'Memory Graph' },
  { to: '/app/search', icon: Search, label: 'Search' },
  { to: '/app/about', icon: Info, label: 'About' },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.aside
        className={`sidebar glass-strong ${mobileOpen ? 'sidebar-open' : ''}`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-logo">
          <Brain size={24} />
          <span>MemoGraph</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
