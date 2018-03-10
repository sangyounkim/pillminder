const moment = require('moment');

const db = require('../database/config');
const connection = db.getConnection();

const REGISTER_CONTAINER = 'INSERT INTO container (user_id, pill_type, reminder_time, frequency) VALUES ';
const OPEN_CONTAINER = 'UPDATE container SET last_opened = NOW() AT TIME ZONE \'utc\' WHERE id = $1';
const GET_REMINDERS = `
  WITH reminder_info AS (
    SELECT
      container_id,
      r.id as reminder_id,
      last_opened,
      reminder_time,
      COALESCE(
          reminder_time - lag(reminder_time) OVER (ORDER BY reminder_time),
          ('24:00'::TIME - first_value(reminder_time) OVER (ORDER BY reminder_time DESC) + reminder_time)::INTERVAL
      ) AS time_since_last
    FROM container c join reminder r
      ON c.id = r.container_id
    WHERE c.id = $1
    ORDER BY reminder_time
  )
  SELECT
    last_opened,
    time_since_last
  FROM reminder_info
  WHERE reminder_id = $2;
`;

const GRACE_PERIOD = 0.5 * 3600;

module.exports = {
  register: (userId, pillType) => {
    return connection.query(REGISTER_CONTAINER, [userId, pillType]);
  },

  open: function(id) {
    return connection.query(OPEN_CONTAINER, [id]);
  },

  remind: async (containerId, reminderId) => {
    try {
      const {
        last_opened: lastOpened,
        time_since_last: timeSinceLastReminder,
      } = await connection.one(GET_REMINDERS, [containerId, reminderId]);

      const { hours, minutes, seconds } = timeSinceLastReminder;
      const timeSinceMidPoint = moment.duration(moment.duration({ hours, minutes, seconds }).asMilliseconds() / 2);
      const midPointSinceLastReminder = moment().subtract(timeSinceMidPoint);
      const shouldRemind = !moment.utc(lastOpened).isBetween(midPointSinceLastReminder, moment());
  
      return shouldRemind;
    } catch (e)  {
      throw new Error('Failed to check reminder status for push notification.');
      console.error(e);
    }
  }
};
