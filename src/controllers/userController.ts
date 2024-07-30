import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
const Comment = require("../models/comment");
const Blog = require("../models/blogPost");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
import { AuthRequest } from "../functions/verifyToken";
const { handleDelete } = require("../configs/cloudinaryConfig");

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
	const [user, posts, comments] = await Promise.all([User.findById(req.params.id).exec(), Blog.find({ author: req.params.id }).sort({ date_posted: -1 }).exec(), Comment.find({ user: req.params.id }).sort({ date_posted: -1 }).populate("blog_post", "title").exec()]);
	res.json({
		user,
		posts,
		comments,
	});
});

exports.delete_user = [
	passport.authenticate("jwt", { session: false }),

	asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
		// Check user authorization (admin privilege)
		if (!req.user || !req.user.admin_access) {
			return res.status(403).json({ error: "Unauthorized: Admin access required." });
		}

		const userId = req.params.id;

		// Find the user by its ID
		const user = await User.findByIdAndDelete(userId).exec();
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		try {
			// Find all comments made by the user
			const userComments = await Comment.find({ user: userId }).exec();
			const commentIds = userComments.map((comment: { _id: string }) => comment._id);

			// Delete all comments made by the user (including replies)
			await Comment.deleteMany({ user: userId }).exec();

			// Find all blogs authored by the user
			const userBlogs = await Blog.find({ author: userId }).exec();

			// Delete all blogs authored by the user and their associated images from Cloudinary
			for (const blog of userBlogs) {
				if (blog.blog_img && blog.blog_img.cloudinary_id) {
					try {
						const cloudinaryResult = await handleDelete(blog.blog_img.cloudinary_id);
						console.log("Cloudinary deletion result:", cloudinaryResult);
					} catch (error) {
						console.error("Error deleting image from Cloudinary:", error);
					}
				}
				await Blog.findByIdAndDelete(blog._id).exec();
			}

			// Remove user's comments from other blogs
			await Blog.updateMany({}, { $pull: { comments: { $in: commentIds } } }).exec();

			res.json({ message: "User deleted successfully" });
		} catch (error) {
			console.error("Error deleting user data:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}),
];
