require('newrelic');
const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./database/index.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', (req, res) => {
  db.getAll((err, data) => {
    if (err) {
      console.log('db.getAll err:', err);
    } else {
      res.send(data).status(200);
    }
  });
});

app.get('/products/:product_id', (req, res) => {
  db.getOne(req.params.product_id, (err, data) => {
    if (err) {
      console.log('db.getOne err:', err);
    } else {
      res.send(data).status(200);
    }
  });
});

app.get('/products/:product_id/styles', (req, res) => {
  db.getStyles(req.params.product_id, (err, data) => {
    if (err) {
      console.log('db.getStyles err:', err);
    } else {
      res.send(data).status(200);
    }
  });
});

app.get('/products/:product_id/related', (req, res) => {
  db.getRelated(req.params.product_id, (err, data) => {
    if (err) {
      console.log('db.getRelated err:', err);
    } else {
      res.send(data).status(200);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = app;