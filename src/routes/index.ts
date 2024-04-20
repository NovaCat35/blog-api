var express = require("express");
var router = express.Router();
const post_controller = require("../controllers/postController");
const user_controller = require("../controllers/userController");
const verifyToken = require("../functions/verifyToken");

/* GET INFO (DOESN'T REQUIRE AUTHENTICATION). */
router.get("/", post_controller.get_all_posts);

router.get("/posts", post_controller.get_all_posts);

router.get("/posts/:id", post_controller.get_post);

router.get('/comments', post_controller.get_comment);

router.get('/users/:id', user_controller.get_user_profile);

// Profile route to fetch user's profile data (need user to be logged in)
router.get('/profile', verifyToken, user_controller.get_personal_profile);

/* POSTING & DELETING: REQUIRES AUTHENTICATION */
// Protected route for posting blog
router.post('/post', verifyToken, post_controller.create_post);

// // Protected route for deleting blog 
// router.delete('/posts', verifyToken, post_controller.delete_post)

// // Protected route for posting comment
// router.post('/comments', verifyToken, post_controller.create_comment);

// // Protected route for deleting comment
// router.delete('/comments', verifyToken, post_controller.delete_comment)

// Protected route for viewing all users (only available for admin)
router.get('/users', verifyToken, user_controller.show_all_users); 


module.exports = router;
