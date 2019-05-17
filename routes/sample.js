const express = require('express');
const router = express.Router();
const rb = require('@flexsolver/flexrb');
//Response Builder
// const qp = require('@flexsolver/flexqp-pooling');


router.get('/', async function (req, res, next) {
  try {
    res.json(rb.build(
      {
        say: `hello world`
      }
    )
    );
  } catch (err) {
    next(err);
  }
});


router.get('/error', async function (req, res, next) {
  try {
    let err = new Error(`expired`) //Exception
    err.status = 409;
    throw err;
  } catch (err) {
    next(err);
  }
});


router.get('/:param', async function (req, res, next) {
  try {
    res.json(
      { message: req.params.param }
    );
  } catch (err) {
    next(err);
  }
});



router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    console.log(body);
    body.id = 0; //false null
    body = build(body);
    res.json(body);
  } catch (err) {
    next(err);
  }
  function build(body) {
    let dao = {
      id: body.id || 9999,
      id2: body.id2 || 8888
    }
    return dao;
  }
});
module.exports = router;
