import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
const Comment = require("../models/comment");
const Blog = require("../models/blogPost");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.get_personal_profile = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		try {
			// Access user information from the authenticated token
			const user = req.user; // Assuming the authenticated user information is stored in req.user

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			res.json({
				username: user.username,
				email: user.email,
				status: user.admin_access,
			});
		} catch (error) {
			console.error("Error fetching user information", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];

exports.show_all_users = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: any, res: Response, next: NextFunction) => {
		if (!req.user || !req.user.admin_access) {
			return res.status(403).json({ error: "Unauthorized: Admin access required." });
		}
		const users = await User.find().sort({ username: 1 }).exec();
		res.json({
			users,
		});
	}),
];

exports.get_user_profile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const [user, posts, comments] = await Promise.all([User.findById(req.params.id).exec(), Blog.find({ username: req.params.id }).sort({ date_posted: 1 }).exec(), Comment.find({ username: req.params.id }).sort({ date_posted: 1 }).exec()]);
	res.json({
		user,
		posts,
		comments,
	});
});
