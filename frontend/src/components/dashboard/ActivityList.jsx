import { AnimatePresence, motion } from 'framer-motion';
import ActivityItem from './ActivityItem';

const ActivityList = ({ activities, onDelete, onEdit, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>

        <p className="text-slate-500 text-sm font-medium">
          No activities yet
        </p>

        <p className="text-slate-400 text-xs mt-1">
          Start by logging your first activity.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity._id}
            activity={activity}
            index={index}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ActivityList;
