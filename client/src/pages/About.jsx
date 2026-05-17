import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, ExternalLink, Server, Code2 } from 'lucide-react';
import { getAbout } from '../lib/api';
import LoadingState from '../components/LoadingState';
import './About.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function About() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbout()
      .then(setInfo)
      .catch(() => setInfo(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="about-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1>About MemoGraph</h1>
        <p className="about-subtitle">API information and backend details</p>
      </motion.div>

      <div className="about-grid">
        {info && (
          <div className="about-card glass">
            <div className="about-card-icon"><Server size={20} /></div>
            <h3>API Info</h3>
            <div className="about-details">
              {Object.entries(info).map(([key, value]) => (
                <div key={key} className="about-row">
                  <span className="about-key">{key}</span>
                  <span className="about-value">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="about-card glass">
          <div className="about-card-icon"><Code2 size={20} /></div>
          <h3>OpenAPI Spec</h3>
          <p>Access the full API documentation in OpenAPI format.</p>
          <a href={`${API_BASE}/openapi.json`} target="_blank" rel="noopener noreferrer" className="about-link">
            <ExternalLink size={14} />
            View OpenAPI JSON
          </a>
        </div>

        <div className="about-card glass">
          <div className="about-card-icon"><Info size={20} /></div>
          <h3>Tech Stack</h3>
          <div className="about-chips">
            {['Express', 'PostgreSQL', 'Prisma', 'JWT', 'Hugging Face', 'React', 'Vite', 'Three.js'].map(t => (
              <span key={t} className="tech-chip">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
