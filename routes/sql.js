const express = require('express');
const router = express.Router();
const rb = require('@flexsolver/flexrb');
const qp = require('@flexsolver/flexqp-pooling');

//獲取全部的使用者
router.get('/', async function (req, res, next) {
  try {
    let users = await qp.executeAndFetchPromise(`select * from user`);
    res.json(rb.build(users));
  } catch (err) {
    next(err);
  }
});

//獲取第一個使用者
router.get('/1', async function (req, res, next) {
  try {
    let user = await qp.executeAndFetchFirstPromise(`select * from user`);
    res.json(rb.build(user));
  } catch (err) {
    next(err);
  }
});

//錯誤
router.get('/2', async function (req, res, next) {
  try {
    let user = await qp.executeAndFetchFirstPromise(`select * from users`);
    res.json(rb.build(user));
  } catch (err) {
    next(err);
  }
});

router.get('/:name', async function (req, res, next) {
  try {
    let user = await qp.executeAndFetchFirstPromise(`select * from user where name = ?`, [req.params.name]);
    res.json(rb.build(user));
  } catch (err) {
    next(err);
  }
});



router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    body = build(body);
    //insert query
    let result = await qp.executeUpdatePromise(`insert into user set ?`, [body]);
    res.json(rb.build(result));
  } catch (err) {
    next(err);
  }
  function build(body) {
    let dao = {
      name: body.name || null,
      contact: body.contact || null,
      email: body.email || null,
    }
    return dao;
  }
});
module.exports = router;
