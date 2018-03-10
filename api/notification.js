const reminder = require('./reminder');
const scheduler = require('./scheduler');

module.exports = {
  schedule: async ({ containerId, frequency, notificationToken, overdueInterval, times }) => {
    try {
      const reminders = await reminder.add({ containerId, frequency, times });
      const scheduledReminders = await scheduler.schedule(notificationToken, { reminders, overdueInterval });
  
      return await reminder.updateJobId(scheduledReminders);
    } catch (e) {
      throw new Error('Failed to schedule reminders.');
      console.error(e);
    }
  },
};
