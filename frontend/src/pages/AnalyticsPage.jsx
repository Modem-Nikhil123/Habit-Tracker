import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ThreeBarChart from '../visualization/ThreeBarChart';
import CategorySummary from '../components/analytics/CategorySummary';
import { formatDuration, formatDate } from '../utils/format';

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

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/activities/analytics');
      if (res.data.success) {
        setAnalyticsData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

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
          Weekly Analytics
        </h1>
        <p className="text-slate-500 text-lg">
          {analyticsData?.weekRange ? (
            <>
              {formatDate(analyticsData.weekRange.start)} - {formatDate(analyticsData.weekRange.end)}
            </>
          ) : (
            'Loading week data...'
          )}
        </p>
      </motion.div>

      {}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Total Time</p>
              <p className="text-2xl font-bold text-slate-900">
                {analyticsData?.summary ? formatDuration(analyticsData.summary.totalMinutes) : '0m'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Activities</p>
              <p className="text-2xl font-bold text-slate-900">
                {analyticsData?.summary?.totalActivities || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Daily Average</p>
              <p className="text-2xl font-bold text-slate-900">
                {analyticsData?.summary ? formatDuration(analyticsData.summary.averagePerDay) : '0m'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8" variants={itemVariants}>
        {}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              Daily Overview
            </h3>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-slate-500 text-sm font-medium">
                    Loading chart...
                  </span>
                </div>
              </div>
            ) : (
              <ThreeBarChart
                data={analyticsData?.dailyTotals || []}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        {}
        <div className="lg:col-span-1">
          <CategorySummary
            categoryData={analyticsData?.categoryDistribution || []}
            totalMinutes={analyticsData?.summary?.totalMinutes || 0}
          />
        </div>
      </motion.div>

      {}
      <motion.div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300" variants={itemVariants}>
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Daily Breakdown
        </h3>

        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.dailyTotals?.map((day, index) => {
                  const maxTotal = Math.max(
                    ...analyticsData.dailyTotals.map(d => d.total),
                    1
                  );
                  const progress = (day.total / maxTotal) * 100;

                  return (
                    <tr
                      key={day.day}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-700">
                          {day.day}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-sm">
                        {formatDate(day.date)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-slate-700">
                          {formatDuration(day.total)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
                              className="h-full bg-indigo-500 rounded-full"
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-10 text-right font-medium">
                            {day.total}m
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
