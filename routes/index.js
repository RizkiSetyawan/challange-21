var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
module.exports = (db) => {

  router.get('/', function (req, res, next) {
    const page = req.query.page || 1
    const limit = 4
    const offset = (page - 1) * limit
    let temp = []
    let filt = false

    if (req.query.id3 && req.query.id) {
      temp.push('id2 = ' + req.query.id)
      filt = true
    }
    if (req.query.string3 && req.query.string) {
      temp.push(`string2 like '${req.query.string}'`)
      filt = true
    }
    if (req.query.integer3 && req.query.integer) {
      temp.push('integer2 = ' + req.query.integer)
      filt = true
    }
    if (req.query.float3 && req.query.float) {
      temp.push('float2 = ' + req.query.float)
      filt = true
    }
    if (req.query.date3 && req.query.date && req.query.date1) {
      temp.push(`date2 between '${req.query.date}' and '${req.query.date1}'`)
      filt = true
    }
    if (req.query.boolean3 && req.query.boolean) {
      temp.push(`boolean2 like '${req.query.boolean}'`)
      filt = true
    }

    let sql = `select count(*) as total from bread`; // 3 total pages sql
    if (filt) {
      sql += ' where ' + temp.join(' and ')
    }
    db.query(sql, (err, response) => {
      const total = response.rows[0].total
      const pages = Math.ceil(total / limit)
      sql = `select * from bread`;
      if (filt) {
        sql += ` where ${temp.join(' and ')}`
      }
      sql += ` order by id2 limit ${limit} offset ${offset}`; // sql
      db.query(sql, (err, response) => {

        // console.log(response.rows[0]);
        res.render('list', {
          title: 'Express',
          data: response.rows,
          pagination: {
            page, limit, offset, total, pages
          },
          moment,
          query: req.query,
        });
      })
    });
  })




  router.get('/add', function (req, res, next) {
    res.render('add', {
      title: "Add Data",
      query: req.query
    })
  })

  router.post('/add', function (req, res, next) {
    db.query(`INSERT INTO bread (string2, integer2, float2, date2, boolean2) VALUES ('${req.body.string2}',${req.body.integer2}, ${req.body.float2}, '${req.body.date2}', '${req.body.boolean2}')`, (err, response) => {
      res.redirect('/')
    })
  });

  router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    db.query(`SELECT * FROM bread where id2 = ${id}`, (err, rows) => {

      if (!err && rows.rows.length > 0) {
        let item = rows.rows[0]
        // console.log(item.date2.toString());
        res.render('edit', {
          item, id, moment,
          query: req.query
        });
      } else {
        res.send('failed !!!!')
      }

    })
  });

  router.post('/edit/:id', (req, res) => {

    db.query(`UPDATE bread SET string2 = '${req.body.string}', integer2 = ${req.body.integer} , float2 = ${req.body.float}, boolean2 = '${req.body.boolean2}', date2 = '${req.body.date}' WHERE id2 = ${req.params.id}`, (err, rows) => {
      if (!err) {
        res.redirect('/')
      } else {
        res.send('failed !!!!')
      }
    })
  });

  router.get('/delete/:id', function (req, res, next) {
    db.query(`DELETE from bread WHERE id2 = $1`, [req.params.id], (err, response) => {
      res.redirect('/')
    })
  });

  return router
}
