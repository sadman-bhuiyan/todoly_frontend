
const express = require('express');
const app = express()
const authRouter = require('./routes/auth');

const port = 3000;

app.use('/', authRouter);

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

process.on('uncaughtException', err => {console.log(err)})



