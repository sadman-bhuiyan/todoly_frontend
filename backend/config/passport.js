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


module.exports = function(passport){
    passport.use(new LocalStrategy((username, password, cb) => {
        connection.connect(err => {
          if (err) {
            console.log('Error connecting to db -> ' + err)
            return;
          }
          console.log("Connected to DB successfully!")
        });
  
        connection.query("SELECT username FROM Users WHERE username=?", [username], async (error, results) => {
          if (error) {
            console.log(error);
            throw error;
          }
  
          if (results.length == 0) {
            res.status(400).json({ response: "username not found" })
          }
          else {
            if (bcrypt.compareSync(password, results[0].password)) {
              return cb(null, { username: results[0].username, id: results[0].id })
            } else {
              return cb(null, false, { message: "incorrect username or password" })
            }
          }
        })
  
      }))
}