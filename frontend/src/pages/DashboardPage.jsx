import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ActivityForm from '../components/dashboard/ActivityForm';
import ActivityList from '../components/dashboard/ActivityList';
import StatsCard from '../components/dashboard/StatsCard';
import { formatDuration } from '../utils/format';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data.activities || []);
    } catch {
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitActivity = async (activityData) => {
    setIsSubmitting(true);
    try {
      if (activityData._id) {
        
        const res = await api.put(`/activities/${activityData._id}`, activityData);
        setActivities(activities.map(a => a._id === activityData._id ? res.data.activity : a));
        toast.success('Activity updated');
        setEditingActivity(null);
      } else {
        
        const res = await api.post('/activities', activityData);
        setActivities([res.data.activity, ...activities]);
        toast.success('Activity logged');
      }
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save activity');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
  };

  const handleDeleteActivity = async (id) => {
    try {
      await api.delete(`/activities/${id}`);
      setActivities(activities.filter((a) => a._id !== id));
      toast.success('Activity deleted');
    } catch {
      toast.error('Failed to delete activity');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayActivities = activities.filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.timestamp).toDateString() === today;
  });

  const yesterdayActivities = activities.filter((a) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(a.timestamp).toDateString() === yesterday.toDateString();
  });

  const todayMinutes = todayActivities.reduce((sum, a) => sum + a.duration, 0);
  const yesterdayMinutes = yesterdayActivities.reduce((sum, a) => sum + a.duration, 0);

  let trend = null;
  let trendUp = true;

  if (yesterdayMinutes === 0) {
    if (todayMinutes > 0) {
      trend = "Start of streak";
      trendUp = true;
    } else {
      trend = "No change";
      trendUp = false; 
    }
  } else {
    const diff = todayMinutes - yesterdayMinutes;
    const percentage = Math.round((diff / yesterdayMinutes) * 100);
    trend = `${percentage > 0 ? '+' : ''}${percentage}% vs yesterday`;
    trendUp = percentage >= 0;
  }

  return (
    <motion.div
      className="p-8 bg-slate-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          {getGreeting()}, <span className="text-indigo-600">{user?.fullName?.split(' ')[0]}</span>
        </h1>
        <p className="text-slate-500 text-lg">
          Let's make today productive.
        </p>
      </motion.div>

      {}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
        <StatsCard
          title="Today's Focus"
          value={formatDuration(todayMinutes)}
          icon={
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={trend}
          trendUp={trendUp}
        />
        <StatsCard
          title="Activities Completed"
          value={todayActivities.length}
          icon={
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatsCard
          title="Total Lifetime"
          value={activities.length}
          icon={
            <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <ActivityForm
            onSubmit={handleSubmitActivity}
            isSubmitting={isSubmitting}
            editData={editingActivity}
            onCancel={handleCancelEdit}
          />
        </motion.div>

        {}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activities
            </h2>

            <ActivityList
              activities={activities}
              onDelete={handleDeleteActivity}
              onEdit={handleEditActivity}
              isLoading={isLoading}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
