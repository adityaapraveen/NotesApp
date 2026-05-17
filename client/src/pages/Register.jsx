import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, UserPlus } from 'lucide-react';
import { registerUser, loginUser } from '../lib/api';
import { setToken } from '../lib/auth';
import Button from '../components/Button';
import './Login.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerUser(form);
      const loginData = await loginUser({ email: form.email, password: form.password });
      setToken(loginData.access_token);
      navigate('/app');
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <motion.div className="auth-card glass-strong" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/" className="auth-logo"><Brain size={32} /><span>MemoGraph</span></Link>
        <h1>Create an account</h1>
        <p className="auth-subtitle">Start building your memory graph</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Name (optional)</label>
            <input id="reg-name" name="name" type="text" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} autoFocus />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input id="reg-password" name="password" type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={handleChange} />
          </div>
          <Button variant="primary" type="submit" loading={loading} icon={UserPlus} className="auth-submit">Create account</Button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </motion.div>
    </div>
  );
}
