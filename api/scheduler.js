// const db = require('../database/config');
// const connection = db.getConnection();

// const SCHEDULE_JOB = 'INSERT INTO jobs VALUES ($1, $2, $3)';

// module.exports = {
//     schedule: function({runAt, repeat, notificationToken}) {
//         return connection.query(SCHEDULE_JOB, [runAt, repeat, notificationToken])
//             .then(function() {
//                 return true;
//             });
//     }
// };

const q = 'default';
const url =
  'amqp://bbbkkxit:OCbM2iS8HsRAofj_drGSZdgCc2vJHJ4h@llama.rmq.cloudamqp.com/bbbkkxit';
const open = require('amqplib').connect(url);

module.exports = {
  schedule: function({ runAt, repeat, notificationToken }) {
    return open
      .then(conn => {
        const ok = conn.createChannel();
        return ok.then(ch => {
          const payload = {
            run_at: runAt,
            repeat,
            notification_token: notificationToken,
          };
          console.log(JSON.stringify(payload));
          return ch.sendToQueue(q, new Buffer(JSON.stringify(payload)));
        });
      });
  } 
};
