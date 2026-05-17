import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, StickyNote, AlertTriangle } from 'lucide-react';
import { getNotes, createNote, updateNote, deleteNote, shareNote } from '../lib/api';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import NoteCard from '../components/NoteCard';
import NoteEditorModal from '../components/NoteEditorModal';
import ShareNoteModal from '../components/ShareNoteModal';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import './Dashboard.css';

export default function Dashboard() {
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [editorNote, setEditorNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getNotes();
      const list = Array.isArray(res) ? res : res.data || [];
      setNotes(list);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleSave = async (data, id) => {
    if (id) {
      await updateNote(id, data);
      toast.success('Note updated');
    } else {
      await createNote(data);
      toast.success('Note created');
    }
    fetchNotes();
  };

  const handleDelete = async (note) => {
    try {
      await deleteNote(note.id);
      toast.success('Note deleted');
      setDeleteConfirm(null);
      fetchNotes();
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleShare = async (noteId, data) => {
    await shareNote(noteId, data);
    toast.success('Note shared');
  };

  const openCreate = () => { setEditorNote(null); setShowEditor(true); };
  const openEdit = (note) => { setEditorNote(note); setShowEditor(true); };

  const filtered = search
    ? notes.filter(n =>
        (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (n.content || '').toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Notes</h1>
          <p className="dashboard-count">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="dashboard-actions">
          <div className="search-box glass">
            <Search size={16} />
            <input type="text" placeholder="Filter notes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button variant="primary" icon={Plus} onClick={openCreate}>New Note</Button>
        </div>
      </div>

      {error && (
        <div className="dashboard-error glass">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchNotes}>Retry</Button>
        </div>
      )}

      {loading ? (
        <LoadingState count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={search ? 'No matching notes' : 'No notes yet'}
          description={search ? 'Try a different search term.' : 'Create your first note to get started.'}
          action={!search && <Button variant="primary" icon={Plus} onClick={openCreate}>Create Note</Button>}
        />
      ) : (
        <motion.div className="notes-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEdit}
                onDelete={n => setDeleteConfirm(n)}
                onShare={n => setShareTarget(n)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <NoteEditorModal
          note={editorNote}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}

      {/* Share Modal */}
      {shareTarget && (
        <ShareNoteModal
          note={shareTarget}
          onClose={() => setShareTarget(null)}
          onShare={handleShare}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <motion.div
            className="modal glass-strong delete-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Delete note?</h3>
            <p>"{deleteConfirm.title || 'Untitled'}" will be permanently deleted.</p>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
