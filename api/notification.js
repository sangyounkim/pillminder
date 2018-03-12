const _ = require('lodash');

const reminder = require('./reminder');
const scheduler = require('./scheduler');

module.exports = {
  schedule: async ({ containerId, frequency, notificationToken, overdueInterval, times }) => {
    try {
      const existingReminders = await reminder.get(containerId);
      if (existingReminders.length > 0) {
        const jobsToDelete = await reminder.removeAll(containerId);
        if (!_.isEmpty(jobsToDelete)) {
          const success = await scheduler.removeAll(jobsToDelete);
          if (!success) {
            throw new Error('Failed to remove jobs using scheduler.');
          }
        }
      }

      if (!_.isEmpty(times)) {
        const reminders = await reminder.add({ containerId, frequency, times });
        const scheduledReminders = await scheduler.schedule(notificationToken, { reminders, overdueInterval });
    
        return await reminder.updateJobId(scheduledReminders);
      }
    } catch (e) {
      throw new Error('Failed to schedule reminders.');
      console.error(e);
    }
  },
};
