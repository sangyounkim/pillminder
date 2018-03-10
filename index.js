const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const container = require('./api/container');
const user = require('./api/user');
const userError = require('./userError');

var HttpStatus = require('http-status-codes');
const scheduler = require('./api/scheduler');
const reminder = require('./api/reminder');
const notification = require('./api/notification');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/signup/checkEmail', function(req, res) {
    var email = req.query.email;
    
    user.checkEmail(email)
        .then(function(available) {
            if (available) {
                res.status(HttpStatus.OK).send();
            } else {
                res.status(HttpStatus.CONFLICT).send();
            }
        })
        .catch(function(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({'error': error});
        });
}) ;

app.post('/signup', function(req, res) {
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    user.signup(firstName, lastName, email, password)
        .then(function(userId) {
            res.status(HttpStatus.OK).send({'user_id': userId});
        })
        .catch(function(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({'error': error});
        });
});

app.post('/login', function(req, res) {
   var email = req.body.email;
   var password = req.body.password;

   user.login(email, password)
       .then(function(userId) {
           res.status(HttpStatus.OK).send({'user_id': userId});
       })
       .catch(function(error) {
           if (error instanceof userError) {
               res.status(error.status).send({'error': error.error});
           } else {
               res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({'error': error});
           }
       });
});

app.post('/:id/deviceToken', function(req, res) {
    var id = req.params.id;
    var deviceToken = req.body.device_token;

    user.addDeviceToken(id, deviceToken)
        .then(function(success) {
            res.status(HttpStatus.OK).send();
        })
        .catch(function(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({"error": error});
        });
});

app.get('/:id/deviceToken', function(req, res) {
    var id = req.params.id;

    user.getDeviceToken(id)
        .then(function(deviceToken) {
            res.status(HttpStatus.OK).send({'device_token': deviceToken});
        })
        .catch(function(error) {
            if (error instanceof  userError) {
                res.status(error.status).send({'error': error.error});
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({'error': error});
            }
        });
});

app.get('/:id/containers', function(req, res) {
    var id = req.params.id;

    user.getContainers(id)
        .then(function(containers) {
            res.status(HttpStatus.OK).send({'containers': containers});
        })
        .catch(function(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({'error': error});
        });
});

app.post('/:id/open', function(req, res) {
    var id = req.params.id;

    container.open(id)
        .then(function() {
            res.status(HttpStatus.OK).send();
        })
        .catch(function(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({'error': error});
        });
});

app.get('/containers/:containerId/reminders', (req, res) => {
    const { containerId } = req.params;

    return reminder.get(containerId)
      .then(reminders => res.status(HttpStatus.OK).send({ reminders }))
      .catch(error => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error }));
});

app.post('/containers/:containerId/reminders', (req, res) => {
    let { containerId } = req.params;
    containerId = parseInt(containerId, 10);
    const { frequency, overdueInterval, times } = req.body;

    // TODO: figure out user's apns token from their username
    const notificationToken = 'ExponentPushToken[WnAKx5Ji4sCe8A1GXaebCe]';

    return notification.schedule({ containerId, notificationToken, frequency, overdueInterval, times })
      .then(() => res.status(HttpStatus.OK).send('Reminder scheduled successfully.'))
      .catch(error => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error }));
});

app.get('/containers/:containerId/reminders/:reminderId', function(req, res) {
    let { containerId, reminderId } = req.params;
    containerId = parseInt(containerId, 10);
    reminderId = parseInt(reminderId, 10);
 
    container.remind(containerId, reminderId)
        .then((remind) => res.status(HttpStatus.OK).send({ remind }))
        .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error }));
 });

app.delete('/containers/:containerId/reminders/:reminderId', (req, res) => {
    const { reminderId } = req.params;
    return reminder.remove(reminderId)
        .then((jobId) => scheduler.remove(jobId))
        .then(() => res.status(HttpStatus.OK).send('Reminder removed successfully.'))
        .catch(error => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error }));
});

app.listen(process.env.PORT || 5001);
