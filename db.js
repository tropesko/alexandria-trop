const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
