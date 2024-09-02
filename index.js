const express = require("express");
require('dotenv').config();
const port = 3000;
const database = require("./config/database");
database.connect();
const app = express();
const Task = require("./models/task.model");

// req phia trc res  thi khi render va send thi res nguoc lai dung req
app.get("/tasks/edit/:id" , async(req , res )=>{
    try {
          const id  = req.params.id;
            const task = await Task.find({
                _id:id,
                deleted:false});
            // chuyen js thanh json trả về cho giao diện 1 mảng json
            res.json(task);

    } catch (error) {
        res.json({
            message:"Not Found"
        })
    }
  
});
app.listen(port  , ()=>{
    console.log(`App listening on port ${port}`);

});
