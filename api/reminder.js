const moment = require('moment');
const _ = require('lodash');

const db = require('../database/config');

const { pg } = db;
const connection = db.getConnection();
const reminderColSet = new pg.helpers.ColumnSet(
  ['container_id', 'reminder_time', 'label', 'frequency', 'job_id'],
  { table: 'reminder' }
);

class Reminder {
  constructor({ id, container_id, reminder_time, label }) {
    this.id = id;
    this.container_id = container_id;
    this.time = reminder_time;
    this.label = label;
  }
}

async function getJobId(reminderId) {
  try {
    const { job_id } = await connection.one('SELECT job_id FROM reminder WHERE id = $1', [reminderId]);
    return job_id;
  } catch (e) {
    throw new Error(`Failed to retrieve job id for reminder id = ${reminderId}`);
    console.error(e);
  }
}

module.exports = {

  add: ({ containerId, times, frequency, scheduledJobs }) => {
    const values = times.map(({ label, time }, index) => ({
      'container_id': containerId,
      'reminder_time': moment.utc(time).format('HH:mm'),
      'label': label,
      'frequency': frequency,
      'job_id': scheduledJobs[index].id,
    }));
    const query = pg.helpers.insert(values, reminderColSet);

    return connection.none(query);
  },

  get: containerId => {
    return connection
      .query(
        'SELECT id, container_id, reminder_time, label FROM reminder WHERE container_id = $1',
        [containerId]
      )
      .then(rows => rows.map(r => new Reminder(r)));
  },

  remove: async (reminderId) => {
    try {
      const jobId = await getJobId(reminderId);
      
      await connection.none('DELETE FROM reminder WHERE id = $1', [reminderId]);
  
      return jobId;
    } catch (e) {
      throw new Error('Failed to delete reminder.')
      console.error(e);
    }
  }

};
