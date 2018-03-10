const pgp = require('pg-promise')();
pgp.pg.types.setTypeParser(1114, s => s);

const db = pgp(process.env.DATABASE_URL);

module.exports = {
    pgp,
    getConnection: function() {
        return db;
    }
};
