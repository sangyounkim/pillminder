const pgp = require('pg-promise')();
// Heroku db needs ssl
pgp.pg.defaults.ssl = true;
pgp.pg.types.setTypeParser(1114, s => s);

const db = pgp(process.env.DATABASE_URL || 'http://127.0.0.1:5000');

module.exports = {
    pgp,
    getConnection: function() {
        return db;
    }
};
