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