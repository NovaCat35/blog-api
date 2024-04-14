var express = require("express");
var router = express.Router();
const post_controller = require("../controllers/postController");
const verifyToken = require("../functions/verifyToken");

/* GET home page. */
router.get("/", post_controller.homepage);

router.get("/posts", post_controller.posts_get);
router.post('/posts', verifyToken, post_controller.create_post);

// router.get('/comments', );
// router.get('/comments/:id', );

// router.get('/profile/:id', );

module.exports = router;
