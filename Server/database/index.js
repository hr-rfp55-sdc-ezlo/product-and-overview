const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'po',
  password: '',
  port: 5432,
});

pool.query('SELECT * FROM products WHERE product_id = 1', (err, res) => {
  console.log('here', err, res);
});


module.exports = pool;
