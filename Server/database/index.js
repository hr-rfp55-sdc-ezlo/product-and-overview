const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'po',
  password: '',
  port: 5432,
  multipleStatements: true
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

var getStyles = (data, cb) => {
  var final = {'product_id': data, results: []};
  pool.query("SELECT s.style_id, s.name, s.original_price, s.sale_price, s.default_style, array_agg(distinct jsonb_build_object('thumbnail_url', p.thumbnail_url, 'url', p.url)) as photos, json_object_agg(sk.id, json_build_object('quantity', sk.quantity, 'size', sk.size)) as skus FROM styles AS s INNER JOIN photos AS p ON p.style_id = s.style_id INNER JOIN skus AS sk ON sk.style_id = s.style_id WHERE s.product_id = $1 GROUP BY s.style_id", [data])
    .then(res => {
      console.log(res.rows);
      cb(null, res.rows);
    })
    .catch(err => cb(err, null));
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
