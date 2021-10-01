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
  pool.query("SELECT p.*, array_agg(distinct jsonb_build_object('feature', f.feature, 'value', f.value)) as features FROM products AS p INNER JOIN features AS f ON p.id = f.product_id WHERE p.id = $1 GROUP BY p.id", [data])
    .then(res => {
      return (
        cb(null, res.rows[0])
      );
    })
    .catch(err => cb(err, null));
};

var getStyles = (data, cb) => {
  var final = {'product_id': data, results: null};
  pool.query(`
    SELECT a.style_id, a.name, a.original_price, a.sale_price, a."default?", array_agg(distinct jsonb_build_object('thumbnail_url', a.thumbnail_url, 'url', a.url)) as photos, json_object_agg(a.id, json_build_object('quantity', a.quantity, 'size', a.size)) as skus
    FROM (SELECT s.style_id, s.name, s.original_price, s.sale_price, s."default?", p.thumbnail_url, p.url, sk.id, sk.quantity, sk.size FROM styles AS s
    INNER JOIN (SELECT photos.style_id, photos.thumbnail_url, photos.url FROM photos) AS p ON p.style_id = s.style_id
    INNER JOIN (SELECT skus.style_id, skus.id, skus.quantity, skus.size FROM skus) AS sk ON sk.style_id = s.style_id
    WHERE s.product_id = $1 GROUP BY s.style_id, p.thumbnail_url, p.url, sk.id, sk.quantity, sk.size) AS a
    GROUP BY a.style_id, a.name, a.original_price, a.sale_price, a."default?"`, [data])
    .then(res => {
      final.results = res.rows;
      cb(null, final);
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
