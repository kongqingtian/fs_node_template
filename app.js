let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');
const jwt = require(`jsonwebtoken`); 
const JWT_SECRET = require('./resources/global').JWT_SECRET;
let rb = require('@flexsolver/flexrb');
let app = express();
let server = require('http').Server(app); //declare server here
let io //= require('socket.io')(server); // declare io here
//require('./controllers/SocketController/socketServer').init(io); init socket server
let cors = require(`cors`);
let qp = require('@flexsolver/flexqp-pooling');
qp.presetConnection(require(`./dbconfig.json`));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// rb.setQpDriver(qp);



function verifyToken(req, res, next) {
  req.token = req.headers[`authorization`] || '';
  jwt.verify(req.token, JWT_SECRET, function (err, decoded) {
    if (err) {
      next(err);
    } else {
      req.user = decoded;
      next();
    }
  });
}

function attachedIO(req, res, next) {   //preset io to res.io
  res.io = io;
  next();
};

async function logResponseBody(req, res, next) {
  //ignore GET api
  if (req.method !== 'GET' && req.body) {
    var oldWrite = res.write,
      oldEnd = res.end;
    var chunks = [];
    res.write = function (chunk) {
      chunks.push(chunk);

      oldWrite.apply(res, arguments);
    };

    res.end = async function (chunk) {
      if (chunk)
        chunks.push(chunk);

      var body = Buffer.concat(chunks).toString('utf8');
      let dao = buildDao(req, body);
      // let r = await qp.executeUpdateIgnorePromise(`insert into log_activities set ?`, [dao]);
      oldEnd.apply(res, arguments);
    };
  }
  next();

  function buildDao(req, resBody) {
    let dao = {
      methodUrl: `${req.method} -> ${req.originalUrl}`,
      req: JSON.stringify(req.body),
      res: resBody
    }
    return dao;
  }
}
// app.use(logResponseBody); //if logging is needed
// app.use(attachedIO); if attached IO is needed in res.io
// app.use(verifyToken);  //if you would like to protect the entire API below
app.use('/index', require(`./routes/sample`));
app.use('/sql', require(`./routes/sql`));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(`${req.method} -> ${req.originalUrl} is not a proper route!`);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  let status = err.status || 500;
  res.status(status);
  let response;
  if (err.sql) {
    response = rb.buildError(err.message, status, { sql: err.sql });
  } else {
    response = rb.buildError(err.message, status, err);
  }
  res.json(response);
});

module.exports = { app: app, server: server, io: io };
