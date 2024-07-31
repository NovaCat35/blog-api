import { Request, Response, NextFunction } from "express";
const Blog = require("../models/blogPost");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
import { AuthRequest } from "../functions/verifyToken";
const passport = require("passport");
const { handleUpload, handleDelete } = require("../configs/cloudinaryConfig");

/**
 * Controller for everything blog related (blog posts, & comments)
 */
exports.get_all_posts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const blogPosts = await Blog.find().populate("author").sort({ date_posted: -1 }).exec();

	res.json({
		message: "Show all blog posts",
		posts: blogPosts,
	});
});

exports.get_post = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const blogPost = await Blog.findById(req.params.id).populate("author").exec();
	res.json({
		message: "Show blog post",
		post: blogPost,
	});
});

exports.create_post = [
	passport.authenticate("jwt", { session: false }),

	// Sanitize body
	body("title").trim().escape(),
	body("read_time").isNumeric().toInt().escape(),
	body("tags").isArray(),
	body("content").trim().notEmpty().escape(),
	body("blog_img.src.name").trim().escape(),
	body("blog_img.src.link").trim().escape(),
	body("published").isBoolean().toBoolean(),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: `Invalid data provided! ${errors.array()}` });
		}

		try {
			if (!req.file) {
				return res.status(400).json({ error: "Missing required parameter - file" });
			}

			// Handle file upload to cloudinary
			const cloudinaryResult = await handleUpload(req.file.path);

			const blog = new Blog({
				tags: req.body.tags,
				read_time: req.body.read_time,
				title: req.body.title,
				content: req.body.content,
				blog_img: {
					img_url: cloudinaryResult.secure_url,
					cloudinary_id: cloudinaryResult.public_id,
					src: {
						name: req.body["blog_img.src.name"],
						link: req.body["blog_img.src.link"],
					},
				},
				author: req.user,
				published: req.body.published,
			});

			const savedBlog = await blog.save();

			res.status(201).json({
				message: "Blog post created successfully.",
				blog: savedBlog,
			});
		} catch (error) {
			console.error("Error creating blog post:", error);
			res.status(500).json({ error: "Internal Server Error." });
		}
	}),
];

exports.edit_post = [
	passport.authenticate("jwt", { session: false }),

	// Sanitize body
	body("title").trim().escape(),
	body("read_time").isNumeric().toInt().escape(),
	body("tags").isArray(),
	body("content").trim().notEmpty().escape(),
	body("blog_img.src.name").trim().escape(),
	body("blog_img.src.link").trim().escape(),
	body("published").isBoolean().toBoolean(),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: "Invalid data provided." });
		}

		try {
			const updatedFields = {
				tags: req.body.tags,
				read_time: req.body.read_time,
				title: req.body.title,
				content: req.body.content,
				blog_img: {
					img_url: req.body.img_file,
					cloudinary_id: "",
					src: {
						name: req.body["blog_img.src.name"],
						link: req.body["blog_img.src.link"],
					},
				},
				author: req.user,
				published: req.body.published,
			};

			const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedFields, { new: true }).exec();

			if (!updatedBlog) {
				return res.status(404).json({ error: "Blog post not found." });
			}

			res.status(201).json({
				message: "Blog post edited successfully.",
				blog: updatedBlog,
			});
		} catch (error) {
			console.error("Error creating blog post:", error);
			res.status(500).json({ error: "Internal Server Error." });
		}
	}),
];

exports.delete_post = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		// Check user authorization (admin privilege)
		if (!req.user || !req.user.admin_access) {
			return res.status(403).json({ error: "Unauthorized: Admin access required." });
		}

		try {
			const deletedBlog = await Blog.findByIdAndDelete(req.params.id).exec();

			if (!deletedBlog) {
				return res.status(404).json({ error: "Blog post not found." });
			}

			// Handle delete blog's img from Cloudinary
			if (deletedBlog.blog_img && deletedBlog.blog_img.cloudinary_id) {
				try{
					const cloudinaryResult = await handleDelete(deletedBlog.blog_img.cloudinary_id)
					console.log("Cloudinary deletion result:", cloudinaryResult);
				} catch (error) {
					console.error("Error deleting image from Cloudinary:", error);
					return res.status(500).json({ error: "Error deleting image from Cloudinary." });
				}
			}
			
			// Fetch all comments associated with the blog
			const comments = await Comment.find({ _id: { $in: deletedBlog.comments } }).exec();

			// Iterate through each comment to delete its replies
			for (const comment of comments) {
				if (comment.replies && comment.replies.length > 0) {
					await Comment.deleteMany({ _id: { $in: comment.replies } }).exec();
				}
			}

			// Delete all comments associated with the blog
			await Comment.deleteMany({ _id: { $in: deletedBlog.comments } }).exec();

			res.json({ message: "Blog post and related comments deleted successfully." });
		} catch (error) {
			console.error("Error deleting comments:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.get_blog_comments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
	const blogPost = await Blog.findById(req.params.id).exec();

	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	// iterate through the blog's comment list of _ids and push the comments documents into an array
	const commentList = await Promise.all(
		blogPost.comments.map(async (commentId: string) => {
			return await Comment.findById(commentId)
				.populate("user")
				.populate({
					path: "replies",
					populate: {
						path: "user",
					},
				})
				.exec();
		})
	);

	const validComments = commentList.filter((comment) => {
		return comment.text !== null;
	});

	// Sort comments by date_posted in descending order
	validComments.sort((a, b) => b.date_posted.getTime() - a.date_posted.getTime());

	res.json({
		commentList: validComments,
	});
});

/**
 * GETS ALL PARENT COMMENTS for blogs.
 * Does not include reply comments b/c CMS site loops through parent comments, which then displays the comment's replies
 * */
exports.get_all_comments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
	// Find all blogs and get their comments
	const blogs = await Blog.find().select("comments").exec();
	const commentIds = blogs.reduce((acc: Array<string>, blog: any) => acc.concat(blog.comments), []);

	const comments = await Comment.find({ _id: { $in: commentIds } })
		.populate("user")
		.populate("blog_post", "title")
		.populate({
			path: "replies",
			populate: {
				path: "user",
			},
		})
		.exec();

	const validComments = comments.filter((comment: any) => {
		return comment.text !== null;
	});

	// Sort comments by date_posted in descending order
	validComments.sort((a: any, b: any) => b.date_posted.getTime() - a.date_posted.getTime());

	res.json({
		commentList: validComments,
	});
});

exports.create_comment = [
	passport.authenticate("jwt", { session: false }),

	// sanitize body
	body("blog_post_id").trim().escape().isMongoId(),
	body("comment").trim().escape().isString(),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const comment = new Comment({
				user: req.user._id,
				blog_post: req.body.blog_post_id,
				text: req.body.comment,
			});

			const createdComment = await comment.save();
			const updatedBlog = await Blog.findByIdAndUpdate(
				req.body.blog_post_id,
				{ $push: { comments: createdComment._id } }, // Push the new comment's ID to the comments array
				{ new: true }
			);

			res.status(201).json({
				message: "Comment created successfully.",
				comment: createdComment,
				updatedBlog: updatedBlog,
			});
		} catch (error) {
			console.error("Error creating comment:", error);
			return res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.create_reply_comment = [
	passport.authenticate("jwt", { session: false }),

	// sanitize body
	body("reply").trim().escape().isString(),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		const parentCommentId = req.params.id;

		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const parentComment = await Comment.findById(parentCommentId);
			if (!parentComment) {
				return res.status(404).json({ message: "Parent comment not found" });
			}

			// Create the reply comment (NOTE: we don't add this "replyComment's id into the blog's comments list like we did with the parent comment")
			const replyComment = new Comment({
				user: req.user._id,
				text: req.body.reply,
				blog_post: parentComment.blog_post, // Associate the reply with the same blog post
				isReply: true,
			});

			await replyComment.save();

			// Add the reply's ID to the parent's replies array
			parentComment.replies.push(replyComment._id);
			await parentComment.save();

			res.status(201).json({ message: "Reply posted successfully", replyComment });
		} catch (error) {
			console.error("Error creating comment:", error);
			return res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.delete_comment = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		// Check user authorization (admin privilege)
		if (!req.user || !req.user.admin_access) {
			return res.status(403).json({ error: "Unauthorized: Admin access required." });
		}

		const commentId = req.params.id;

		// Find the comment by its ID
		const comment = await Comment.findById(commentId).exec();
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Delete all replies to this comment
		await Comment.deleteMany({ _id: { $in: comment.replies } }).exec();

		// Delete the parent comment itself
		await Comment.findByIdAndDelete(commentId).exec();

		// Find the blog containing this comment
		const blog = await Blog.findOne({ comments: { $in: commentId } });

		if (blog) {
			// Remove the comment ID from the blog's comments array
			blog.comments.pull(commentId);
			await blog.save();
		}

		res.json({ message: "Comment deleted successfully" });
	}),
];

exports.delete_reply = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		// Check user authorization (admin privilege)
		if (!req.user || !req.user.admin_access) {
			return res.status(403).json({ error: "Unauthorized: Admin access required." });
		}

		const commentId = req.params.commentId;
		const replyId = req.params.replyId;

		// Delete the comment
		const deletedReply = await Comment.findByIdAndDelete(replyId).exec();
		if (!deletedReply) {
			return res.status(404).json({ message: "Reply not found" });
		}

		// Find the parent comment containing this reply
		const comment = await Comment.findOne({ replies: replyId });

		if (comment) {
			// Remove the reply's ID from the parent comment's array
			comment.replies.pull(replyId);
			await comment.save();
		}

		res.json({ message: "Reply deleted successfully" });
	}),
];

exports.edit_comment = [
	passport.authenticate("jwt", { session: false }),

	// sanitize body
	body("comment").trim().escape().isString(),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		const commentId = req.params.id;

		// Edit the comment
		const editComment = await Comment.findByIdAndUpdate(commentId, { text: req.body.comment, edited: true }, { new: true }).exec();
		if (!editComment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		res.json({ message: "Comment edited successfully", editComment });
	}),
];

exports.handle_comment_likes = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		const commentId = req.params.id;
		const currUserId = req.user._id;

		try {
			// Find the comment by its ID
			const comment = await Comment.findById(commentId).exec();

			if (!comment) {
				return res.status(404).json({ message: "Comment not found" });
			}

			// Check if the user has already liked the comment
			const userLikedComment = comment.likes.includes(currUserId);

			if (userLikedComment) {
				// Remove user's like
				comment.likes.pull(currUserId);
			} else {
				// Add user's like
				comment.likes.push(currUserId);
			}

			// Save the updated comment
			await comment.save();

			res.json({ message: "Comment liked/un-liked successfully" });
		} catch (err) {
			next(err);
		}
	}),
];

// Gets back the apy key for Tiny MCE
exports.get_tiny_mce_api_key = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		res.json({ api_key: process.env.TINY_MCE_API_KEY });
	}),
];
