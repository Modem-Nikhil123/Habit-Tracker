const CATEGORY_STYLES = {
  Work: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  Study: { 
    bg: 'bg-violet-50', 
    border: 'border-violet-200', 
    text: 'text-violet-600',
    dot: 'bg-violet-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  Exercise: { 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200', 
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  Break: { 
    bg: 'bg-amber-50', 
    border: 'border-amber-200', 
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  Other: { 
    bg: 'bg-slate-50', 
    border: 'border-slate-200', 
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    )
  },
};

const CategorySummary = ({ categoryData, totalMinutes }) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getPercentage = (total) => {
    if (totalMinutes === 0) return 0;
    return Math.round((total / totalMinutes) * 100);
  };

  
  const sortedData = [...categoryData].sort((a, b) => b.total - a.total);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Category Distribution
      </h3>

      {totalMinutes === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">No activities this week</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedData.map((item) => {
            const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Other;
            const percentage = getPercentage(item.total);

            return (
              <div 
                key={item.category}
                className={`p-4 rounded-lg border ${style.border} ${style.bg} transition-all hover:shadow-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`${style.text}`}>
                      {style.icon}
                    </div>
                    <span className="font-medium text-slate-700">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${style.text}`}>
                      {formatDuration(item.total)}
                    </span>
                  </div>
                </div>
                
                {}
                <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${style.dot} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-slate-500">
                    {percentage}% of total
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.total} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategorySummary;
