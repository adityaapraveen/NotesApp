import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';
import './NoteEditorModal.css';

export default function NoteEditorModal({ note, onClose, onSave }) {
  const isEditing = !!note?.id;
  const isReadOnly = note?.access === 'shared';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) {
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave({ title: title.trim(), content: content.trim() }, note?.id);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save note');
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
          className="modal glass-strong"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{isReadOnly ? 'View Note' : isEditing ? 'Edit Note' : 'New Note'}</h2>
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {error && <div className="modal-error">{error}</div>}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                type="text"
                className="form-input"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={isReadOnly}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="note-content">Content</label>
              <textarea
                id="note-content"
                className="form-input form-textarea"
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                readOnly={isReadOnly}
                rows={8}
              />
            </div>

            <div className="modal-actions">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              {!isReadOnly && (
                <Button variant="primary" type="submit" loading={loading}>
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
