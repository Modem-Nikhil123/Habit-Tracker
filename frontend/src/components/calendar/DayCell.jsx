const CATEGORY_STYLES = {
  Work: { bg: 'bg-blue-500', ring: 'ring-blue-200' },
  Study: { bg: 'bg-violet-500', ring: 'ring-violet-200' },
  Exercise: { bg: 'bg-emerald-500', ring: 'ring-emerald-200' },
  Break: { bg: 'bg-amber-500', ring: 'ring-amber-200' },
  Other: { bg: 'bg-slate-400', ring: 'ring-slate-200' },
};

const DayCell = ({ 
  date, 
  isCurrentMonth, 
  isToday, 
  isSelected, 
  hasActivities, 
  activityCount,
  categories,
  onClick 
}) => {
  const dayNumber = date.getDate();
  
  
  const categoryColors = categories?.slice(0, 3).map(cat => 
    CATEGORY_STYLES[cat]?.bg || CATEGORY_STYLES.Other.bg
  ) || [];

  return (
    <button
      onClick={() => onClick(date)}
      disabled={!isCurrentMonth}
      className={`
        relative w-full aspect-square flex flex-col items-center justify-center
        rounded-lg transition-all duration-200 group
        ${isCurrentMonth 
          ? 'hover:bg-slate-100 cursor-pointer' 
          : 'cursor-default opacity-30'
        }
        ${isToday 
          ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' 
          : ''
        }
        ${isSelected 
          ? 'bg-blue-600 hover:bg-blue-600 text-white shadow-md' 
          : ''
        }
      `}
    >
      {}
      <span className={`
        text-sm font-medium transition-colors
        ${isSelected 
          ? 'text-white' 
          : isToday 
            ? 'text-blue-600' 
            : isCurrentMonth 
              ? 'text-slate-700 group-hover:text-slate-900' 
              : 'text-slate-400'
        }
      `}>
        {dayNumber}
      </span>

      {}
      {hasActivities && isCurrentMonth && (
        <div className="absolute bottom-1.5 flex items-center gap-0.5">
          {categoryColors.map((color, index) => (
            <span
              key={index}
              className={`
                w-1 h-1 rounded-full transition-all
                ${color}
                ${isSelected ? 'opacity-80' : ''}
              `}
            />
          ))}
          {activityCount > 3 && (
            <span className={`
              text-[8px] font-medium ml-0.5
              ${isSelected ? 'text-blue-100' : 'text-slate-400'}
            `}>
              +{activityCount - 3}
            </span>
          )}
        </div>
      )}

      {}
      {isSelected && (
        <span className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full" />
      )}
    </button>
  );
};

export default DayCell;
