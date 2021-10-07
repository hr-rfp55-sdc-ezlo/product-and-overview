const { Pool } = require('pg');

const pool = new Pool({
  user: 'wanglibo',
  host: '52.53.238.151',
  database: 'awsdb',
  password: '',
  port: 5432,
  multipleStatements: true
});

var getAll = (cb) => {
  pool.query('SELECT * FROM products WHERE product_id BETWEEN 1 AND 25')
    .then(res => cb(null, res.rows))
    .catch(err => cb(err, null));
};

var getOne = (data, cb) => {
  var result;
  pool.query(`SELECT a.*, COALESCE (array_agg(json_build_object('value', a.value, 'feature', a.feature)) FILTER (WHERE a.value IS NOT NULL), '{}') as features
    FROM (
      SELECT p.*, f.product_id, f.feature, f.value
      FROM products as p
      LEFT JOIN features as f ON p.product_id = f.product_id
      WHERE p.product_id = $1
    ) as a
    GROUP BY a.product_id`, [data])
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
    SELECT c.style_id, c.name, c.original_price, c.sale_price, c."default?",
      COALESCE (array_agg(jsonb_build_object('url', c.url, 'thumbnail_url', c.thumbnail_url)) FILTER (WHERE c.url IS NOT NULL), '{}') as photos,
      COALESCE (jsonb_object_agg(c.id, jsonb_build_object('size', c.size, 'quantity', c.quantity)) FILTER (WHERE c.id IS NOT NULL), '[]') as skus
    FROM (
      SELECT s.style_id, s.name, s.original_price, s.sale_price, s."default?", p.url, p.thumbnail_url, sk.id, sk.size, sk.quantity
      FROM styles as s
      LEFT JOIN photos as p ON p.style_id = s.style_id
      LEFT JOIN skus as sk ON sk.style_id = s.style_id
      WHERE s.product_id = $1
    ) as c
    GROUP BY c.style_id, c.name, c.original_price, c.sale_price, c."default?"`, [data])
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


// SELECT s.style_id, s.name, s.original_price, s.sale_price, s."default?",
//       COALESCE (array_agg(jsonb_build_object('url', pLink.url, 'thumbnail_url', pLink.thumbnail_url)) FILTER (WHERE pLink.url IS NOT NULL), '{}') as photos,
//       COALESCE (jsonb_object_agg(sOthers.id, jsonb_build_object('size', sOthers.size, 'quantity', sOthers.quantity)) FILTER (WHERE sOthers.id IS NOT NULL), '[]') as skus
//     FROM styles AS s
//     LEFT JOIN (SELECT photos.style_id, photos.url, photos.thumbnail_url FROM photos) as pLink
//       ON pLink.style_id = s.style_id
//     LEFT JOIN (SELECT skus.id, skus.style_id, skus.size, skus.quantity FROM skus) as sOthers
//       ON sOthers.style_id = s.style_id
//     WHERE s.product_id = $1
//     GROUP BY s.style_id

// SELECT p.*, COALESCE (array_agg(json_build_object('value', fMisc.value, 'feature', fMisc.feature)) FILTER (WHERE fMisc.value IS NOT NULL), '{}') as features
//     FROM (
//       SELECT p.*, f.product_id, f.feature, f.value
//       FROM products as p
//       LEFT JOIN
//     )
//     products AS p
//     LEFT JOIN (SELECT features.product_id, features.feature, features.value FROM features) as fMisc ON p.product_id = fMisc.product_id
//     WHERE p.product_id = $1
//     GROUP BY p.product_id
