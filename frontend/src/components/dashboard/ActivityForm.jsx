import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'Work', label: 'Work' },
  { value: 'Study', label: 'Study' },
  { value: 'Exercise', label: 'Exercise' },
  { value: 'Break', label: 'Break' },
  { value: 'Other', label: 'Other' },
];

const ActivityForm = ({ onSubmit, isSubmitting, editData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    category: 'Study',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        duration: editData.duration,
        category: editData.category,
      });
    } else {
      setFormData({ name: '', duration: '', category: 'Study' });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Activity name is required');
      return;
    }

    if (!formData.duration || parseInt(formData.duration) < 1) {
      toast.error('Duration must be at least 1 minute');
      return;
    }

    if (parseInt(formData.duration) > 1440) {
      toast.error('Duration cannot exceed 24 hours');
      return;
    }

    const success = await onSubmit({
      name: formData.name.trim(),
      duration: parseInt(formData.duration),
      category: formData.category,
      _id: editData?._id, 
    });

    if (success && !editData) {
      setFormData({ name: '', duration: '', category: 'Study' });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          {editData ? 'Edit Activity' : 'Log Activity'}
        </h2>
        {editData && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Activity Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., DSA Practice"
            maxLength={100}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="1440"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="30"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="flex gap-3">
          {editData && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 focus:outline-none transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                {editData ? 'Updating...' : 'Logging...'}
              </span>
            ) : (
              editData ? 'Update Activity' : 'Log Activity'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ActivityForm;
