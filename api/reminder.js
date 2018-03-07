const moment = require('moment');

const db = require('../database/config');

const { pg } = db;
const connection = db.getConnection();
const reminderColSet = new pg.helpers.ColumnSet(
  ['container_id', 'reminder_time', 'label'],
  { table: 'reminder' }
);

class Reminder {
  constructor({ reminder_time, label }) {
    this.time = reminder_time;
    this.label = label;
  }
}

module.exports = {

  add: (containerId, runAt) => {
    const values = runAt.map(({ label, time }) => ({
      container_id: containerId,
      reminder_time: moment.utc(time).format('HH:mm'),
      label,
    }));
    const query = pg.helpers.insert(values, reminderColSet);

    return connection.none(query);
  },

  get: containerId => {
    return connection
      .query(
        'SELECT container_id, reminder_time, label FROM reminder WHERE container_id = $1',
        [containerId]
      )
      .then(rows => rows.map(r => new Reminder(r)));
  },

};
