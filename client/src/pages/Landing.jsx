import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Network,
  Share2,
  Search,
  Sparkles,
  Code2,
  PenLine,
  Cpu,
  GitBranch,
  Globe,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';
import './Landing.css';

const features = [
  {
    icon: Shield,
    title: 'Authenticated Private Notes',
    description: 'JWT-secured personal note vault. Your thoughts stay yours with enterprise-grade authentication.',
  },
  {
    icon: Network,
    title: 'Semantic Memory Graph',
    description: 'Watch your notes form intelligent connections through AI-powered embeddings in a stunning 3D visualization.',
  },
  {
    icon: Share2,
    title: 'Collaborative Sharing',
    description: 'Share notes with colleagues by email. Control access and collaborate seamlessly.',
  },
  {
    icon: Search,
    title: 'Full-Text Search',
    description: 'Find any note instantly with powerful full-text search across your entire knowledge base.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Connections',
    description: 'Hugging Face embeddings find hidden relationships between your notes automatically.',
  },
  {
    icon: Code2,
    title: 'OpenAPI-Ready Backend',
    description: 'Fully documented REST API with OpenAPI spec. Build integrations and extend freely.',
  },
];

const steps = [
  { icon: PenLine, title: 'Write notes', desc: 'Capture your thoughts, ideas, and knowledge in rich notes.' },
  { icon: Cpu, title: 'Embeddings are generated', desc: 'AI models analyze your content and create semantic vectors.' },
  { icon: GitBranch, title: 'Similar notes connect', desc: 'Related ideas are automatically linked based on meaning.' },
  { icon: Globe, title: 'Explore your 3D graph', desc: 'Navigate your knowledge as an interactive 3D memory graph.' },
];

const techStack = ['PostgreSQL', 'Prisma', 'JWT', 'Hugging Face', 'Express', 'React'];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="hero-headline">
              Turn scattered notes into a{' '}
              <span className="text-gradient">living memory graph</span>
            </h1>
            <p className="hero-subheadline">
              MemoGraph connects your notes using embeddings, semantic search,
              and a 3D knowledge graph. Think clearer. Remember everything.
            </p>
            <div className="hero-actions">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/register')}
              >
                Start writing
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={Network}
                onClick={() => navigate('/register')}
              >
                View memory graph
              </Button>
            </div>
          </motion.div>

          {/* Mock Dashboard Visual */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mock-dashboard glass-strong">
              <div className="mock-topbar">
                <div className="mock-dots">
                  <span /><span /><span />
                </div>
                <span className="mock-title">MemoGraph Dashboard</span>
              </div>
              <div className="mock-body">
                <div className="mock-sidebar">
                  <div className="mock-nav-item active" />
                  <div className="mock-nav-item" />
                  <div className="mock-nav-item" />
                </div>
                <div className="mock-content">
                  <div className="mock-note-card">
                    <div className="mock-note-title" />
                    <div className="mock-note-line" />
                    <div className="mock-note-line short" />
                  </div>
                  <div className="mock-note-card">
                    <div className="mock-note-title" />
                    <div className="mock-note-line" />
                    <div className="mock-note-line short" />
                  </div>
                </div>
                <div className="mock-graph">
                  <svg viewBox="0 0 200 200" className="mock-graph-svg">
                    <line x1="100" y1="60" x2="50" y2="130" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
                    <line x1="100" y1="60" x2="150" y2="120" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4" />
                    <line x1="50" y1="130" x2="150" y2="120" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
                    <line x1="100" y1="60" x2="100" y2="160" stroke="#10b981" strokeWidth="1" opacity="0.3" />
                    <line x1="50" y1="130" x2="100" y2="160" stroke="#8b5cf6" strokeWidth="1" opacity="0.25" />
                    <circle cx="100" cy="60" r="12" fill="#3b82f6" opacity="0.8">
                      <animate attributeName="r" values="12;14;12" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="130" r="9" fill="#8b5cf6" opacity="0.8">
                      <animate attributeName="r" values="9;11;9" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="150" cy="120" r="10" fill="#06b6d4" opacity="0.8">
                      <animate attributeName="r" values="10;12;10" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="100" cy="160" r="7" fill="#10b981" opacity="0.7">
                      <animate attributeName="r" values="7;9;7" dur="3.2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Strip */}
      <section className="tech-strip">
        <div className="container">
          <p className="tech-strip-label">Built with</p>
          <div className="tech-strip-items">
            {techStack.map((tech) => (
              <span key={tech} className="tech-chip">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Everything you need for a<br /><span className="text-gradient">connected mind</span></h2>
            <p>Powerful features designed to turn your notes into a living knowledge network.</p>
          </motion.div>
          <div className="features-grid">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>How <span className="text-gradient">MemoGraph</span> works</h2>
            <p>Four simple steps to build your second brain.</p>
          </motion.div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-icon-wrap">
                  <step.icon size={28} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-card glass-strong"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-glow" />
            <h2>Ready to build your <span className="text-gradient">memory graph</span>?</h2>
            <p>Start capturing notes and let AI discover the connections for you.</p>
            <div className="hero-actions">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/register')}
              >
                Get started free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} MemoGraph. Built as an exploration in knowledge connectivity.</p>
        </div>
      </footer>
    </div>
  );
}
