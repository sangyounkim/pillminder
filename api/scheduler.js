const fetch = require('node-fetch');

const SCHEDULER_API = process.env.PMSCHEDULER_URL || 'http://127.0.0.1:5000';
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

  removeAll: async (jobIdList) => {
    try {
      const res = await fetch(REMOVE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'jobs': jobIdList,
        }),
      });
      return res.ok;
    } catch (e) {
      throw new Error('Failed to remove jobs through scheduler API');
      console.error(e);
    }
  }
};
