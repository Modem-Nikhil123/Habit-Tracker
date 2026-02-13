const StatsCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            {icon}
          </div>

          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {value}
            </p>
          </div>
        </div>

        {trend && (
          <div className={`flex items-center text-xs font-semibold ${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
