var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {
  router.get('/', function (req, res, next) {
    db.query('SELECT * FROM bread', (err, response) => {
      res.render('list', {
        title: 'Express',
        data: response.rows
      });
    })
  });

  router.get('/add', function (req, res, next) {
    res.render('add', {
      title: "Add Data"
    })
  })

  router.post('/add', function (req, res, next) {
    db.query(`INSERT INTO bread (string2, integer2, float2, date2, boolean2) VALUES ('${req.body.string2}',${req.body.integer2}, ${req.body.float2}, '${req.body.date2}', '${req.body.boolean2}')`, (err, response) => {
      res.redirect('/')
    })
  });

  return router
}
