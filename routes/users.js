var express = require('express');
var router = express.Router();

var Users= require('../controllers/user');

// routes dealing with user collection

router.post('/register',Users.register);
router.get('/verify',Users.verify);
router.delete('/delete/:id',Users.deleteuser);
router.post('/login',Users.login);
router.get('/login',Users.linkedinloginview);
router.get('/login/linkedin',Users.linkedinlogin);
router.get('/login/linkedin/callback',Users.linkedinlogincallback);

module.exports = router;
