import { motion } from 'framer-motion';
import { Clock, Share2, Trash2, Edit3 } from 'lucide-react';
import './NoteCard.css';

export default function NoteCard({ note, onEdit, onDelete, onShare }) {
  const canManageNote = note.access !== 'shared';

  const handleActionClick = (event, action) => {
    event.stopPropagation();
    action?.(note);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const preview =
    note.content?.length > 120
      ? note.content.slice(0, 120) + '…'
      : note.content || '';

  return (
    <motion.div
      className="note-card glass"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => onEdit?.(note)}
    >
      <div className="note-card-header">
        <h3 className="note-card-title">
          {note.title || 'Untitled'}
        </h3>
        {note.access && (
          <span className={`note-badge note-badge-${note.access}`}>
            {note.access}
          </span>
        )}
      </div>

      <p className="note-card-preview">{preview || 'No content yet...'}</p>

      <div className="note-card-footer">
        <div className="note-card-meta">
          <Clock size={12} />
          <span>{formatDate(note.updated_at || note.created_at)}</span>
        </div>

        <div className="note-card-actions">
          {canManageNote && (
            <>
              <button
                className="note-action"
                onClick={(event) => handleActionClick(event, onEdit)}
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                className="note-action"
                onClick={(event) => handleActionClick(event, onShare)}
                title="Share"
              >
                <Share2 size={14} />
              </button>
              <button
                className="note-action note-action-danger"
                onClick={(event) => handleActionClick(event, onDelete)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
