
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
let express = require('express');
let router = express.Router();
const db = require("mysql2");
const connection = db.createConnection({
  host: process.env.HOST,
  user: process.env.USR,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: process.env.PORT,
});


function loggedIn(req, res, next) {
    console.log(req.user);
    if (req.user) {
        next();
    } else {
        res.status(401).json({message: 'User not logged in'});
    }
}

router.get('/todos', loggedIn, (req, res, next) => {
    connection.connect(err => {
        if (err) {
          console.log('Error connecting to db -> ' + err)
          return;
        }
        console.log("Connected to DB successfully!")
      });
    res.status(200).json({message: "Success"})
});

router.post('/createtodos', loggedIn, (req, res,next)=>{
    connection.connect(err => {
        if (err) {
          console.log('Error connecting to db -> ' + err)
          return;
        }
        console.log("Connected to DB successfully!")
      });

      connection.query('INSERT INTO Todos (id,title, todoText, userID) VALUES (?, ?, ?, ?)', [uuidv4(), req.body.title, req.body.todoText, req.user.id], async (error) => {
        if(error){
            res.status(503).json({message: "Error in creating todo"})
            throw error;
        }else{
            res.status(200).json({message: "Todo created successfully!"})
        }
      });
});

router.post('/updatetodos', loggedIn, (req, res,next)=>{
    connection.connect(err => {
        if (err) {
          console.log('Error connecting to db -> ' + err)
          return;
        }
        console.log("Connected to DB successfully!")
      });

      connection.query('UPDATE Todos SET id = ?,title = ?, todoText = ?, userID = ? WHERE id = ?', [req.body.id, req.body.title, req.body.todoText, req.user.id, req.body.id], async (error) => {
        if(error){
            res.status(503).json({message: "Error in updating todo"})
            throw error;
        }else{
            res.status(200).json({message: "Todo updated successfully!"})
        }
      });
});

module.exports = router;
