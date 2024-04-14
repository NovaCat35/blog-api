var express = require('express');
var router = express.Router();
const auth_controller = require("../controllers/authController");


/* AUTHENICATION */
router.get('/signup', );
router.post('/signup', );

router.post('/login', auth_controller.login);

router.get('/logout', );

module.exports = router;
