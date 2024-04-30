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
	body("texts").trim().notEmpty().escape(),
	body("blog_img").trim().escape(),
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
				texts: req.body.texts,
				blog_img: req.body.blog_img,
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
			res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.edit_post = [
	passport.authenticate("jwt", { session: false }),

	// Sanitize body
	body("tags").isArray().escape(),
	body("read_time").isNumeric().toInt().escape(),
	body("title").trim().escape(),
	body("texts").trim().notEmpty().escape(),
	body("blog_img").trim().escape(),
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
				texts: req.body.texts,
				blog_img: req.body.blog_img,
				published: req.body.published,
			};

			const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedFields, { new: true }).exec();

			if (!updatedBlog) {
				return res.status(404).json({ error: "Blog post not found" });
			}

			res.status(201).json({
				message: "Blog post edited successfully.",
				blog: updatedBlog,
			});
		} catch (error) {
			console.error("Error creating blog post:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.delete_post = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		const deletedBlog = await Blog.findByIdAndDelete(req.params.id).exec();

		if (!deletedBlog) {
			return res.status(404).json({ error: "Blog post not found" });
		}

		try {
			// Additionally delete all dependent comments attached to the deleted blog
			await Comment.deleteMany({ _id: { $in: deletedBlog.comments } }).exec();

			res.json({ message: "Blog post and related comments deleted successfully" });
		} catch (error) {
			console.error("Error deleting comments:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.get_all_comments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
	const comments = await Comment.find().populate("author").sort({ date_posted: -1 }).exec();

	res.json({
		comments,
	});
});

exports.create_comment = [
	passport.authenticate("jwt", { session: false }),

	// sanitize body
	body("blog_post").trim().escape(),
	body("comment").trim().escape(),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const comment = new Comment({
				user: req.user,
				blog_post: req.body.blog_post,
				comment: req.body.comment,
			});

			const createdComment = await comment.save();
			const updatedBlog = await Blog.findByIdAndUpdate(
				req.body.blog_post,
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
		Comment.findByIdAndDelete(req.params.id).exec();
		res.json({ message: "Comment deleted successfully" });
	}),
];
