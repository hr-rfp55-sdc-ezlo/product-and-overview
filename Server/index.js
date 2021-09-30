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

// app.get('/products/:product_id', (req, res) => {
//   res.send({message: 'Hello From Server!'});
// });

// app.get('/products/:product_id/styles', (req, res) => {
//   res.send({message: 'Hello From Server!'});
// });

// app.get('/products/:product_id/related', (req, res) => {
//   res.send({message: 'Hello From Server!'});
// });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = app;