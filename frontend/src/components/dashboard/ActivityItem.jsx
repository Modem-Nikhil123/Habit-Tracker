import { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_STYLES = {
  Work: { dot: 'bg-indigo-500', text: 'text-indigo-600' },
  Study: { dot: 'bg-violet-500', text: 'text-violet-600' },
  Exercise: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  Break: { dot: 'bg-amber-500', text: 'text-amber-600' },
  Other: { dot: 'bg-slate-400', text: 'text-slate-500' },
};

const ActivityItem = ({ activity, onDelete, onEdit, index }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const style = CATEGORY_STYLES[activity.category] || CATEGORY_STYLES.Other;

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(activity._id);
    setIsDeleting(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, backgroundColor: '#f8fafc' }}
      transition={{ duration: 0.2 }}
      className={`group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm ${isDeleting ? 'opacity-50' : 'opacity-100'
        }`}
    >
      {}
      <div className={`w-2 h-2 rounded-full ${style.dot} flex-shrink-0`} />

      {}
      <div className="flex-1 min-w-0">
        <p className="text-slate-800 text-sm font-medium truncate">
          {activity.name}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium ${style.text}`}>
            {activity.category}
          </span>

          <span className="text-slate-300">·</span>

          <span className="text-xs text-slate-500">
            {formatDuration(activity.duration)}
          </span>

          <span className="text-slate-300">·</span>

          <span className="text-xs text-slate-500">
            {formatTime(activity.timestamp)}
          </span>
        </div>
      </div>

      {}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(activity)}
          disabled={isDeleting}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
          title="Edit activity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </motion.button>

        {}
        <motion.button
          whileHover={{ scale: 1.1, color: '#dc2626', backgroundColor: '#fef2f2' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-slate-400 rounded-lg disabled:opacity-50"
          title="Delete activity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ActivityItem;
