import { Activity } from '../../database/models/index.js';


export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities.',
    });
  }
};


export const createActivity = async (req, res) => {
  try {
    const { name, duration, category } = req.body;

    
    if (!name || !duration || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, duration, and category are required.',
      });
    }

    const validCategories = ['Work', 'Study', 'Exercise', 'Break', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be Work, Study, Exercise, Break, or Other.',
      });
    }

    if (duration < 1 || duration > 1440) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be between 1 and 1440 minutes.',
      });
    }

    const activity = await Activity.create({
      userId: req.user._id,
      name: name.trim(),
      duration: parseInt(duration),
      category,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully.',
      activity,
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create activity.',
    });
  }
};


export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found.',
      });
    }

    
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this activity.',
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully.',
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity.',
    });
  }
};


export const updateActivity = async (req, res) => {
  try {
    const { name, duration, category } = req.body;
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found.',
      });
    }

    
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this activity.',
      });
    }

    
    if (!name || !duration || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, duration, and category are required.',
      });
    }

    if (duration < 1 || duration > 1440) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be between 1 and 1440 minutes.',
      });
    }

    const validCategories = ['Work', 'Study', 'Exercise', 'Break', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category.',
      });
    }

    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { name, duration: parseInt(duration), category },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully.',
      activity,
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update activity.',
    });
  }
};


export const getCalendarActivities = async (req, res) => {
  try {
    const { month, year } = req.query;

    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    const activities = await Activity.find({
      userId: req.user._id,
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 });

    
    const grouped = activities.reduce((acc, activity) => {
      const dateKey = activity.timestamp.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push({
        _id: activity._id,
        name: activity.name,
        duration: activity.duration,
        category: activity.category,
        timestamp: activity.timestamp,
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      month: targetMonth + 1,
      year: targetYear,
      activities: grouped,
    });
  } catch (error) {
    console.error('Get calendar activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar data.',
    });
  }
};


export const getAnalytics = async (req, res) => {
  try {
    
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      userId: req.user._id,
      timestamp: { $gte: startOfWeek, $lte: endOfWeek },
    });

    
    const dailyTotals = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    
    days.forEach((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      dailyTotals[day] = {
        day,
        date: date.toISOString().split('T')[0],
        total: 0,
      };
    });

    
    const categoryTotals = {
      Work: 0,
      Study: 0,
      Exercise: 0,
      Break: 0,
      Other: 0,
    };

    
    activities.forEach((activity) => {
      const dayIndex = activity.timestamp.getDay();
      const dayName = days[dayIndex];
      dailyTotals[dayName].total += activity.duration;
      categoryTotals[activity.category] += activity.duration;
    });

    
    const dailyData = days.map((day) => dailyTotals[day]);
    const categoryData = Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));

    
    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
    const totalActivities = activities.length;

    res.status(200).json({
      success: true,
      weekRange: {
        start: startOfWeek.toISOString().split('T')[0],
        end: endOfWeek.toISOString().split('T')[0],
      },
      summary: {
        totalMinutes,
        totalActivities,
        averagePerDay: Math.round(totalMinutes / 7),
      },
      dailyTotals: dailyData,
      categoryDistribution: categoryData,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics.',
    });
  }
};

export default {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getCalendarActivities,
  getAnalytics,
};
