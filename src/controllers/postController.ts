import { Request, Response, NextFunction } from "express";
const Blog = require("../models/blogPost");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
import { AuthRequest } from "../functions/verifyToken";
const passport = require("passport");

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
	body("tags").isArray().escape(),
	body("read_time").isNumeric().toInt().escape(),
	body("title").trim().escape(),
	body("content").trim().notEmpty().escape(),
	body("blog_img.img_file").trim().escape(),
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
			const blog = new Blog({
				tags: req.body.tags,
				read_time: req.body.read_time,
				title: req.body.title,
				content: req.body.content,
				blog_img: {
					img_id: req.body.blog_img.img_id,
					src: {
						name: req.body.blog_img.src.name,
						link: req.body.blog_img.src.link,
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
	body("tags").isArray().escape(),
	body("read_time").isNumeric().toInt().escape(),
	body("title").trim().escape(),
	body("content").trim().notEmpty().escape(),
	body("blog_img.img_file").trim().escape(),
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
					img_id: req.body.blog_img.img_id,
					src: {
						name: req.body.blog_img.src.name,
						link: req.body.blog_img.src.link,
					},
				},
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
		const deletedBlog = await Blog.findByIdAndDelete(req.params.id).exec();

		if (!deletedBlog) {
			return res.status(404).json({ error: "Blog post not found." });
		}

		try {
			// Additionally delete all dependent comments attached to the deleted blog
			await Comment.deleteMany({ _id: { $in: deletedBlog.comments } }).exec();

			res.json({ message: "Blog post and related comments deleted successfully." });
		} catch (error) {
			console.error("Error deleting comments:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.get_all_comments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
	const blogPost = await Blog.findById(req.params.id).exec();

	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	// iterate through the blog's comment list of _ids and push the comments documents into an array
	const commentList = await Promise.all(
		blogPost.comments.map(async (commentId: string) => {
			return await Comment.findById(commentId).populate("user").exec();
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

exports.delete_comment = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		const commentId = req.params.id;

		// Delete the comment
		const deletedComment = await Comment.findByIdAndDelete(commentId).exec();
		if (!deletedComment) {
			return res.status(404).json({ message: "Comment not found" });
		}

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

exports.edit_comment = [
	passport.authenticate("jwt", { session: false }),

	// sanitize body
	body("comment").trim().escape().isString(),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		const commentId = req.params.id;

		// Edit the comment
		const editComment = await Comment.findByIdAndUpdate(commentId, { text: req.body.comment }, { new: true }).exec();
		if (!editComment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		res.json({ message: "Comment edited successfully", editComment });
	}),
];

// Gets back the apy key for Tiny MCE
exports.get_tiny_mce_api_key = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		res.json({ api_key: process.env.TINY_MCE_API_KEY });
	}),
];
