import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, LogIn } from 'lucide-react';
import { isAuthenticated } from '../lib/auth';
import Button from './Button';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  return (
    <motion.nav
      className="navbar glass"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <Brain size={28} />
          <span>MemoGraph</span>
        </Link>

        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <div className="navbar-actions">
          {loggedIn ? (
            <Button variant="primary" size="sm" onClick={() => navigate('/app')}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={LogIn}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
