let express = require('express');
let bcrypt = require('bcryptjs');
const db = require('../db')

let router = express.Router();

router.post('/signup', (req, res) => {

    const form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    console.log(fields);
  });
  /*
    console.log(req.body)
    bcrypt.genSalt(10, function(salt) {    
        bcrypt.hash(req.body.password, salt, (hash) => {
            db.createUser(req.body.username, hash).then(res.status(200).send("User created successfully!")).catch(err => {res.status(400).send("User already exist or problem connecting to DB")});
        });
    });
    */

});

module.exports = router ;