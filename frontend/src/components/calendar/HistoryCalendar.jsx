import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import CalendarGrid from './CalendarGrid';
import DayActivityPanel from './DayActivityPanel';

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

const HistoryCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activitiesByDate, setActivitiesByDate] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth, currentYear]);

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/activities/calendar', {
        params: {
          month: currentMonth + 1, 
          year: currentYear,
        },
      });

      if (res.data.success) {
        setActivitiesByDate(res.data.activities || {});
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    setSelectedDate(null); 
  };

  
  const getSelectedDateKey = () => {
    if (!selectedDate) return null;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateKey = getSelectedDateKey();
  const selectedActivities = selectedDateKey ? (activitiesByDate[selectedDateKey] || []) : [];

  
  const totalActivities = Object.values(activitiesByDate).flat().length;
  const totalMinutes = Object.values(activitiesByDate)
    .flat()
    .reduce((sum, a) => sum + a.duration, 0);
  const activeDays = Object.keys(activitiesByDate).length;

  return (
    <motion.div
      className="p-8 bg-slate-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">
          Activity History
        </h1>
        <p className="text-slate-500">
          View your past activities by date
        </p>
      </motion.div>

      {}
      <motion.div className="grid grid-cols-3 gap-4 mb-6" variants={itemVariants}>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Time</p>
              <p className="text-lg font-semibold text-slate-800">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Activities</p>
              <p className="text-lg font-semibold text-slate-800">{totalActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Days</p>
              <p className="text-lg font-semibold text-slate-800">{activeDays}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {}
      <motion.div className="grid grid-cols-3 gap-6" variants={itemVariants}>
        {}
        <div className="col-span-2">
          {isLoading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-slate-500 text-sm font-medium">
                    Loading calendar...
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <CalendarGrid
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDate={selectedDate}
              activitiesByDate={activitiesByDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
            />
          )}
        </div>

        {}
        <div className="col-span-1">
          <DayActivityPanel
            selectedDate={selectedDate}
            activities={selectedActivities}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HistoryCalendar;
