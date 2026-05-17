import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, StickyNote } from 'lucide-react';
import { searchNotes } from '../lib/api';
import NoteCard from '../components/NoteCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import './SearchPage.css';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchNotes(q);
      const list = Array.isArray(res) ? res : res.data || [];
      setResults(list);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <div className="search-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1>Search Notes</h1>
        <p className="search-subtitle">Find notes by keywords across your entire knowledge base</p>
      </motion.div>

      <div className="search-input-wrap glass-strong">
        <SearchIcon size={20} />
        <input
          type="text"
          placeholder="Type to search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading ? (
        <LoadingState count={3} />
      ) : searched && results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No results found"
          description={`No notes matched "${query}". Try different keywords.`}
        />
      ) : results.length > 0 ? (
        <>
          <p className="search-results-count">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          <div className="notes-grid">
            {results.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      ) : (
        !searched && (
          <EmptyState
            icon={StickyNote}
            title="Search your notes"
            description="Start typing to find notes by title or content."
          />
        )
      )}
    </div>
  );
}
