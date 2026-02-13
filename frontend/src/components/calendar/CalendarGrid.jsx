import DayCell from './DayCell';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarGrid = ({
  currentMonth,
  currentYear,
  selectedDate,
  activitiesByDate,
  onDateSelect,
  onMonthChange
}) => {

  
  const generateCalendarDays = () => {
    const days = [];

    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay(); 

    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        dateKey: formatDateKey(date),
      });
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        isCurrentMonth: true,
        dateKey: formatDateKey(date),
      });
    }

    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        dateKey: formatDateKey(date),
      });
    }

    return days;
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getActivitiesForDate = (dateKey) => {
    return activitiesByDate[dateKey] || [];
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  const days = generateCalendarDays();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-slate-800">
          {MONTHS[currentMonth]} {currentYear}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const activities = getActivitiesForDate(day.dateKey);
          const categories = [...new Set(activities.map(a => a.category))];

          return (
            <DayCell
              key={index}
              date={day.date}
              isCurrentMonth={day.isCurrentMonth}
              isToday={isToday(day.date)}
              isSelected={isSelected(day.date)}
              hasActivities={activities.length > 0}
              activityCount={activities.length}
              categories={categories}
              onClick={onDateSelect}
            />
          );
        })}
      </div>

      {}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Work</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span>Study</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Exercise</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Break</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
