const CATEGORY_STYLES = {
  Work: { dot: 'bg-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-50' },
  Study: { dot: 'bg-violet-500', text: 'text-violet-600', bg: 'bg-violet-50' },
  Exercise: { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  Break: { dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
  Other: { dot: 'bg-slate-400', text: 'text-slate-500', bg: 'bg-slate-50' },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DayActivityPanel = ({ selectedDate, activities }) => {
  if (!selectedDate) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">
            Select a date to view activities
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return { day, month, year, weekday };
  };

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
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const { day, month, year, weekday } = formatDate(selectedDate);
  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col animate-fadeIn">
      {}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">{day}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {month} {year}
            </h3>
            <p className="text-sm text-slate-500">{weekday}</p>
          </div>
        </div>

        {activities.length > 0 && (
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDuration(totalMinutes)} total</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{activities.length} {activities.length === 1 ? 'activity' : 'activities'}</span>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-4">
        {activities.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">
                No activities recorded
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Activities you log will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity, index) => {
              const style = CATEGORY_STYLES[activity.category] || CATEGORY_STYLES.Other;

              return (
                <div
                  key={activity._id || index}
                  className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {}
                  <div className={`w-2 h-2 rounded-full ${style.dot} flex-shrink-0`} />

                  {}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-sm font-medium truncate">
                      {activity.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-medium ${style.text}`}>
                        {activity.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-700">
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayActivityPanel;
