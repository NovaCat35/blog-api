var express = require("express");
var router = express.Router();
const post_controller = require("../controllers/postController");
const user_controller = require("../controllers/userController");
const verifyToken = require("../functions/verifyToken");
const upload = require("../middlewares/multer");

/* GET INFO (DOESN'T REQUIRE AUTHENTICATION). */
router.get("/", post_controller.get_all_posts);

router.get("/posts", post_controller.get_all_posts);

router.get("/posts/:id", post_controller.get_post);

router.get("/posts/:id/comments", post_controller.get_blog_comments);

router.get("/comments", post_controller.get_all_comments);

router.get("/users/:id", user_controller.get_user_profile);

// Profile route to fetch user's profile data (need user to be logged in)
router.get("/profile", verifyToken, user_controller.get_personal_profile);

/* POSTING & DELETING: REQUIRES AUTHENTICATION */
// Protected route for posting blog
router.post("/posts", verifyToken, upload.single("img_file"), post_controller.create_post);

// Protected route for editing blog
router.put("/posts/:id", verifyToken, post_controller.edit_post);

// Protected route for deleting blog
router.delete("/posts/:id", verifyToken, post_controller.delete_post);

// Protected route for posting comment
router.post("/comments", verifyToken, post_controller.create_comment);

// Protected route for posting reply comment
router.post("/comments/:id/reply", verifyToken, post_controller.create_reply_comment);

// Protected route for deleting comment
router.delete("/comments/:id", verifyToken, post_controller.delete_comment);

router.delete("/comments/:commentId/replies/:replyId", verifyToken, post_controller.delete_reply);

// Protected route for editing comment
router.put("/comments/:id", verifyToken, post_controller.edit_comment);

// Protected route for adding/removing user's like of a comment
router.put("/comments/:id/likes", verifyToken, post_controller.handle_comment_likes);

// Protected route for viewing all users (only available for admin)
router.get("/users", verifyToken, user_controller.show_all_users);

// Protected route for deleting users
router.delete("/users/:id", verifyToken, user_controller.delete_user);

// Get api key for tiny-mce
router.get("/tiny_mce_api_key", verifyToken, post_controller.get_tiny_mce_api_key);

module.exports = router;
