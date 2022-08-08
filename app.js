
const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/auth');
const todoRouter = require('./routes/todos');
const session = require("express-session");
let passport = require('passport');



const port = 8000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge:  parseInt(process.env.SESSION_MAX_AGE), httpOnly: true}
}));
app.use(express.json())
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/', todoRouter);

const server = app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})



// Graceful shutdown of app
process.on('SIGINT', () => {
  console.log('\n[server] Shutting down...');
  server.close();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('\n[server] Shutting down...');
  server.close();
  process.exit();
});

process.on('uncaughtException', err => { console.log(err) })



