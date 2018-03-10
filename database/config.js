const pgp = require('pg-promise')();
pgp.pg.types.setTypeParser(1114, s => s);

const config = {
    // ssl: true,
    host: 'localhost',
    port: 5432,
    database: 'sangyounkim'
};
const db = pgp(config);

module.exports = {
    pgp,
    getConnection: function() {
        return db;
    }
};
