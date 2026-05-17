import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import Button from './Button';
import './ShareNoteModal.css';

export default function ShareNoteModal({ note, onClose, onShare }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onShare(note.id, { share_with_email: email.trim() });
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to share note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal glass-strong share-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Share Note</h2>
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <p className="share-note-title">
            Sharing: <strong>{note?.title || 'Untitled'}</strong>
          </p>

          {error && <div className="modal-error">{error}</div>}

          {success ? (
            <div className="share-success">
              ✓ Note shared successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="share-email">Email address</label>
                <input
                  id="share-email"
                  type="email"
                  className="form-input"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={loading} icon={Send}>
                  Share
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
