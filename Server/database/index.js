const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'po',
  password: '',
  port: 5432,
});

var getAll = (cb) => {
  pool.query('SELECT * FROM products WHERE id BETWEEN 1 AND 25', (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, res.rows);
    }
  });
};

var getOne = (data, cb) => {
  pool.query('SELECT * FROM products WHERE id = $1', [data], (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, res.rows);
    }
  });
};

var getStyles = (data) => {
  pool.query('SELECT * FROM products WHERE product_id = 1', (err, res) => {
    console.log('here', err, res);
  });
};

var getRelated = (data) => {
  pool.query('SELECT * FROM products WHERE product_id = 1', (err, res) => {
    console.log('here', err, res);
  });
};

module.exports = { pool, getAll, getOne, getRelated, getStyles };
