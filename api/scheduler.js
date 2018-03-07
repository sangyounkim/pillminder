const amqp = require('amqplib');

const q = 'default';
const url = 'amqp://bbbkkxit:OCbM2iS8HsRAofj_drGSZdgCc2vJHJ4h@llama.rmq.cloudamqp.com/bbbkkxit';
const open = amqp.connect(url);

module.exports = {
  schedule: function({ containerId, notificationToken, repeat, runAt }) {
    if (!runAt) return;
    if (Array.isArray(runAt) && runAt.length === 0) return;

    if (!Array.isArray(runAt)) {
      runAt = [runAt];
    }

    return open
      .then(conn => {
        const ok = conn.createChannel();
        return ok.then(ch => {
          const payload = {
            'container_id': containerId,
            'notification_token': notificationToken,
            repeat,
            'run_at': runAt.map(({ time }) => time),
          };
          console.log(JSON.stringify(payload));
          return ch.sendToQueue(q, new Buffer(JSON.stringify(payload)));
        });
      });
  } 
};
