require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');


const whiteList = ['http://localhost', undefined];
const corsOption = {
    origin: function (origin, callback) {
        //console.log(origin)
        if (whiteList.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    }
}

var myLogger = function (req, res, next) {
  console.log('Access From: '+req.headers['user-agent']);
  console.log('Host: '+req.headers['host']);
  console.log('Method: '+req.method);
  console.log('Time: '+Date.now());
  next()
}

app.use(myLogger)

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(bodyParser.json());
app.use(cors(corsOption))


routes(app)

app.listen(port);
console.log("Server started with port " + port);