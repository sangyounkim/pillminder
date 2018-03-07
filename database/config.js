const pg = require('pg-promise')();

const config = {
    // ssl: true,
    host: 'localhost',
    port: 5432,
    database: 'sangyounkim'
};
const db = pg(config);

module.exports = {
    pg,
    getConnection: function() {
        return db;
    }
};
