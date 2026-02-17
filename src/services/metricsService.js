const { users } = require('../models/db');
const { workouts } = require('../models/db');

exports.getMetrics = (username) => {
  const user = users[username];
  if (!user) throw new Error('User not found');
  const goal = user.goal || 200;
  const workoutsUser = workouts[username] || [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const totalYear = workoutsUser.filter(t => t.year == currentYear).length;
  const totalMonth = workoutsUser.filter(t => t.year == currentYear && t.month == currentMonth).length;
  const percentage = goal ? Math.round((totalYear / goal) * 100) : 0;
  return { goal, totalYear, totalMonth, percentage };
};

exports.setGoal = (username, goal) => {
  if (!users[username]) throw new Error('User not found');
  if (typeof goal !== 'number' || goal <= 0) {
    throw new Error('The annual goal should be a number greater than zero.');
  }
  users[username].goal = goal;
};
