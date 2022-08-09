let express = require('express');
let bcrypt = require('bcryptjs');
const formidable = require('formidable');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
let passport = require('passport');
let LocalStrategy = require('passport-local');
const xss = require('xss')
const db = require("mysql2");






const connection = db.createConnection({
  host: process.env.HOST,
  user: process.env.USR,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: process.env.PORT,
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function verify(username, password, cb) {
  connection.connect(err => {
    if (err) {
      console.log('Error connecting to db -> ' + err)
      return;
    }
    console.log("Connected to DB successfully!")
  });
  connection.query("SELECT username, password, id FROM Users WHERE username=?", [xss(username)], async (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }

    if (results.length == 0) {
      return cb(null, false, {
        message: 'User not found'
      })

    }
    else {
      if (bcrypt.compareSync(password, results[0].password)) {
        return cb(null, { username: results[0].username, id: results[0].id })
      }
      return cb(null, false, {
        message: 'Password is wrong'
      })
    }
  })
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


let router = express.Router();

router.post('/login', (req, res) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.status(401).json(err);
    }
    if (user) {
      req.logIn(user, function (err) {
        if (err) throw (err);

        console.log('is authenticated?: ' + req.isAuthenticated());
        return res.json({
          success: true,
          message: 'Successful Login',
          user
        });
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res)
})
router.post('/logout', (req, res) => {
  req.logout((err) => { if (err) { return next(err); } });
  res.status(200).json({message: 'Logging out...'})
});


router.post('/signup', (req, res) => {
  connection.connect(err => {
    if (err) {
      console.log('Error connecting to db -> ' + err)
      return;
    }
    console.log("Connected to DB successfully!")
  });

    console.log(req.body);
    connection.query("SELECT username FROM Users WHERE username=?", [xss(req.body.user.username)], async (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }

      if (results.length > 0) {
        res.status(409).json({ response: "User already exist" })
      }
      else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.user.password, salt);
        connection.query('INSERT INTO Users (id,username, password) VALUES (?, ?, ?)', [uuidv4(), xss(req.body.user.username), hashedPassword], (error) => {
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




module.exports = router;