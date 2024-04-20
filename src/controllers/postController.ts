import { Request, Response, NextFunction } from "express";
const Blog = require("../models/blogPost");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
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

// exports.create_post = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
//    passport.authenticate("jwt", { session: false }),

//    jwt.verify(req.token, `${process.env.SECRET_KEY}`, (err: Error, authData: any) => {
// 		console.log(`this is token: ${req.token}`);
// 		if (err) {
// 			res.sendStatus(403);
// 		} else {
// 			res.json({
// 				message: "Blog post created...",
// 				authData,
// 			});
// 		}
// 	});
// });
exports.create_post = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		console.log(`this is token: ${req.token}`);

		res.json({
			message: "Blog post created...",
		});
	}),
];

// exports.delete_post = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {});

exports.get_comment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
	const comments = await Comment.find().populate("author").sort({ date_posted: -1 }).exec();

	res.json({
		comments,
	});
});

// exports.create_comment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {});

// exports.delete_comment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {});
