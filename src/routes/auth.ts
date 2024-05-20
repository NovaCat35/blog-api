var express = require('express');
var router = express.Router();
const auth_controller = require("../controllers/authController");

/* AUTHENTICATIONS */
// Login route to generate JWT token
router.post('/login', auth_controller.login);

// Signup route to generate JWT token
router.post('/signup', auth_controller.signup);

// Logout removes saved JWT
router.get('/logout', auth_controller.logout);

module.exports = router;
