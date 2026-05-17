import './LoadingState.css';

export default function LoadingState({ count = 3, type = 'card' }) {
  if (type === 'spinner') {
    return (
      <div className="loading-spinner-wrap">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card glass">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-text" />
          <div className="skeleton-line skeleton-text short" />
          <div className="skeleton-footer">
            <div className="skeleton-line skeleton-meta" />
          </div>
        </div>
      ))}
    </div>
  );
}
