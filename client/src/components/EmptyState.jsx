import { motion } from 'framer-motion';
import './EmptyState.css';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={48} />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-desc">{description}</p>
      )}
      {action && <div className="empty-state-action">{action}</div>}
    </motion.div>
  );
}
