const fetch = require('node-fetch');

const SCHEDULER_API = 'http://localhost:5000';
const SCHEDULE = `${SCHEDULER_API}/scheduler/add`;
const REMOVE = `${SCHEDULER_API}/scheduler/remove`;

module.exports = {
  schedule: async (notificationToken, { reminders, overdueInterval }) => {
    try {
      const res = await fetch(SCHEDULE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'notification_token': notificationToken,
          'reminders': reminders,
          'overdue_interval': overdueInterval,
        })
      });
      const data = await res.json();
      const { scheduled_jobs = []} = data;
  
      return scheduled_jobs;
    } catch (e) {
      throw new Error('Failed to schedule jobs through scheduler API');
      console.error(e);
    }
  },

  remove: async (jobId) => {
    try {
      const res = await fetch(REMOVE + '/' + jobId, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      throw new Error('Failed to remove jobs through scheduler API');
      console.error(e);
    }
  },
};
