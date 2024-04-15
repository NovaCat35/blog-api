var express = require("express");
var router = express.Router();
const post_controller = require("../controllers/postController");
const verifyToken = require("../functions/verifyToken");

/* GET INFO (DOESN'T REQUIRE AUTHENTICATION). */
router.get("/", post_controller.homepage);

router.get("/posts", post_controller.posts_get);

router.get('/comments', verifyToken, post_controller.create_post);

router.get('/profile/:id', post_controller.get_profile);

// Profile route to fetch user's profile data (need user to be logged in)
router.get('/profile', verifyToken, post_controller.get_personal);

/* POSTING & DELETING: REQUIRES AUTHENTICATION */
// Protected route for posting blog
router.post('/posts', verifyToken, post_controller.create_post);

// Protected route for deleting blog 
router.delete('/posts', verifyToken, post_controller.delete_post)

// Protected route for posting comment
router.post('/comments', verifyToken, post_controller.create_comment);

// Protected route for deleting comment
router.delete('/comments', verifyToken, post_controller.delete_comment)

// Protected route for viewing all users (only available for admin)
router.post('/users', verifyToken, post_controller.show_users); 


module.exports = router;
