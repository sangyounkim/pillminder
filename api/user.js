const db = require('../database/config');
const connection = db.getConnection();
const Container = require('../container');
const UserError = require('../userError');
const HttpStatus = require('http-status-codes');

const SIGN_UP = "INSERT INTO user_info (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id";
const ADD_DEVICE_TOKEN = "INSERT INTO device_token (id, device_token) VALUES ($1, $2)";

const CHECK_EMAIL = "SELECT id FROM user_info WHERE email = $1";
const GET_PASSWORD = "SELECT password, id FROM user_info WHERE email = $1";
const GET_DEVICE_TOKEN = "SELECT device_token FROM device_token WHERE id = $1";
const GET_CONTAINERS = "SELECT * FROM container LEFT JOIN drug_info ON pill_type = brand_name WHERE user_id = $1";

module.exports = {
    checkEmail: function(email) {
        return connection.query(CHECK_EMAIL, [email])
            .then(function(rows) {
                if (rows.length == 0) return true;
                return false;
            });
    },

    signup: function(firstName, lastName, email, password) {
        return connection.query(SIGN_UP, [firstName, lastName, email, password])
            then(function(rows) {
                return rows[0].id;
            });
    },

    login: function(email, password) {
        return connection.query(GET_PASSWORD, [email])
            .then(function(rows) {
                if (rows.length == 0) {
                    throw new UserError(HttpStatus.UNAUTHORIZED, "INVALID_EMAIL");
                } else if (rows[0].password != password) {
                    throw new UserError(HttpStatus.UNAUTHORIZED, "INVALID_PASSWORD");
                } else {
                    return rows[0].id;
                }
            });
    },

    addDeviceToken: function(id, deviceToken) {
        return connection.query(ADD_DEVICE_TOKEN, [id, deviceToken])
            .then(function() {
                return true;
            });
    },

    getDeviceToken: function(id) {
        return connection.query(GET_DEVICE_TOKEN, [id])
            .then(function(rows) {
                if (rows.length == 0) {
                    throw new UserError(HttpStatus.NOT_FOUND, "INVALID_USER");
                } else {
                    return rows[0].device_token;
                }
            });
    },

    getContainers: function(id) {
        return connection.query(GET_CONTAINERS, [id])
            .then(rows => rows.map(r => new Container(r)));
    }
};
