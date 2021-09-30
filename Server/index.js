const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./database/index.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', (req, res) => {
  res.send({message: 'Hello From Server!'});
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});




module.exports = app;