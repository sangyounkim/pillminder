const reminder = require('./reminder');
const scheduler = require('./scheduler');

module.exports = {
  schedule: async ({ containerId, frequency, notificationToken, times }) => {
    const reminders = await reminder.add({ containerId, frequency, times });
    const scheduledReminders = await scheduler.schedule(notificationToken, reminders);

    return await reminder.updateJobId(scheduledReminders);
  },
};
