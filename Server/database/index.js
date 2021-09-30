const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'po',
  password: '',
  port: 5432,
});

var getAll = (cb) => {
  pool.query('SELECT * FROM products WHERE id BETWEEN 1 AND 25')
    .then(res => cb(null, res.rows))
    .catch(err => cb(err, null));
};

var getOne = (data, cb) => {
  var result;
  //TODO Improvement on Multiple Query
  pool.query('SELECT * FROM products WHERE id = $1', [data])
    .then(res => {
      return (
        result = res.rows[0],
        pool.query('SELECT feature, value FROM features WHERE product_id = $1', [data])
          .then(response => {
            return (
              result.features = response.rows,
              cb(null, result)
            );
          })
          .catch(err => cb(err, null))
      );
    })
    .catch(err => cb(err, null));
};

var getStyles = (data) => {
  pool.query('SELECT * FROM products WHERE product_id = 1', (err, res) => {
    console.log('here', err, res);
  });
};

var getRelated = (data, cb) => {
  var relatedRes = [];
  pool.query('SELECT related_product_id FROM related WHERE product_id = $1', [data])
    .then(res => {
      return (
        res.rows.forEach(elem => {
          relatedRes.push(elem.related_product_id);
        }),
        cb(null, relatedRes)
      );
    })
    .catch(err => cb(err, null));
};

module.exports = { pool, getAll, getOne, getRelated, getStyles };
