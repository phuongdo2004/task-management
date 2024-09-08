const express = require("express");
require('dotenv').config();
// chuyen json thanh js
const bodyParser = require("body-parser");
const port = 3000;
//CORS
var cors = require("cors");

const database = require("./config/database");
database.connect();
const app = express();
// c1 Ap dung cho tat ca ten mien
app.use(cors());

// c2 ap dung cho 1 ten mien cu the

// var corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
  
// app.get('/products/:id', cors(corsOptions), function (req, res, next) {
//     res.json({msg: 'This is CORS-enabled for only example.com.'})
//   })
  
////////////
const Task = require("./models/task.model");
const routerAPI = require("./router/client/index.router");
// req phia trc res  thi khi render va send thi res nguoc lai dung req
app.use(bodyParser.json());
routerAPI(app);

app.listen(port , ()=>{
    console.log(`App listening on port ${port}`);

});
