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
  pool.query(`SELECT p.*, COALESCE (array_agg(json_build_object('value', fMisc.value, 'feature', fMisc.feature)) FILTER (WHERE fMisc.value IS NOT NULL), '{}') as features
    FROM products AS p
    LEFT JOIN (SELECT features.product_id, features.feature, features.value FROM features) as fMisc ON p.id = fMisc.product_id
    WHERE p.id = $1
    GROUP BY p.id`, [data])
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
    SELECT s.style_id, s.name, s.original_price, s.sale_price, s."default?",
      COALESCE (array_agg(distinct jsonb_build_object('url', pLink.url, 'thumbnail_url', pLink.thumbnail_url)) FILTER (WHERE pLink.url IS NOT NULL), '{}') as photos,
      COALESCE (jsonb_object_agg(sOthers.id, jsonb_build_object('size', sOthers.size, 'quantity', sOthers.quantity)) FILTER (WHERE sOthers.id IS NOT NULL), '[]') as skus
    FROM styles AS s
    LEFT JOIN (SELECT photos.style_id, photos.url, photos.thumbnail_url FROM photos) as pLink
      ON pLink.style_id = s.style_id
    LEFT JOIN (SELECT skus.id, skus.style_id, skus.size, skus.quantity FROM skus) as sOthers
      ON sOthers.style_id = s.style_id
    WHERE s.product_id = $1
    GROUP BY s.style_id`, [data])
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
