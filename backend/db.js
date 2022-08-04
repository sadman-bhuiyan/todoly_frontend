require('dotenv').config()
const { v4: uuidv4 } = require('uuid');

const db = require("mysql2")
let connection = db.createConnection({
    host     : process.env.HOST,
    user     : process.env.USR,
    password : process.env.PASSWORD,
    database : process.env.DB,
    port     : process.env.PORT,
});


const createUser = async (username, hashed_password) => {
    console.log(process.env.USR)
    
    try{
    connection.connect();
    }catch(err){
        console.log("database down!")
    }
      try{
      connection.query('INSERT INTO users (id,username, hashed_password) VALUES (?, ?, ?)', [uuidv4(), username, hashed_password]);
      res.status(200).send("User created successfully")
      } catch(err){
        res.status(403).send("User already exist.")
      }
      connection.close();
}

module.exports ={
    createUser
}
