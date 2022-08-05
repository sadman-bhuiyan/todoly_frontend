let express = require('express');
let bcrypt = require('bcryptjs');
const formidable = require('formidable');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
let passport = require('passport');
let LocalStrategy = require('passport-local');







const db = require("mysql2");
const connection = db.createConnection({
  host: process.env.HOST,
  user: process.env.USR,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: process.env.PORT,
});


let router = express.Router();

router.post('/login', (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields) => {
    if (err) {
      throw err;
    }
    passport.authenticate('local', {failureMessage: true }),
  function(req, res) {
    console.log(res);
  }
  })
  res.status(200).json({message: 'hello'})

})

router.post('/signup', (req, res) => {
  connection.connect(err => {
    if (err) {
      console.log('Error connecting to db -> ' + err)
      return;
    }
    console.log("Connected to DB successfully!")
  });
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields) => {
    if (err) {
      console.log(err);
    }
    connection.query("SELECT username FROM Users WHERE username=?", [fields.username], async (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }

      if (results.length > 0) {
        res.status(409).json({ response: "User already exist" })
      }
      else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(fields.password, salt);
        connection.query('INSERT INTO Users (id,username, password) VALUES (?, ?, ?)', [uuidv4(), fields.username, hashedPassword], (error) => {
          if (error != null) {
            console.log(error)
            throw error
          };
        });
        res.status(200).json({ response: "User created!" })
      }
    })
  }
  )
});



module.exports = router;