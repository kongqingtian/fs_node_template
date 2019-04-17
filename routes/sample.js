const express = require('express');
const router = express.Router();
const rb = require('@flexsolver/flexrb');
const qp = require('@flexsolver/flexqp-pooling');


router.get('/', async function (req, res, next) {
  try {
    console.log(req.user);
    let name = `JBL Boombox`;
    let result = await qp.executeAndFetchPromise(`select * from products where name = ? `, [name]);
    res.json(rb.build(result, 'Success!'));
  } catch (err) {
    next(err);
  }
});

router.get('/:param', async function (req, res, next) {
  try {
    console.log(req.user);
    res.json(rb.build({ message: req.params.param }, 'Success!'));
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let dao = buildConfigDao(body);
    let insertResult = await qp.executeUpdatePromise(`insert into configs set ?`, [dao]);
    res.json(rb.build(insertResult, 'Success!'));
  } catch (err) {
    next(err);
  }
  function buildConfigDao(body) {
    let dao = {
      terminalName: body.name
    }
    return dao;
  }


});
module.exports = router;
