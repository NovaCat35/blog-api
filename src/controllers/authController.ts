import { Request, Response, NextFunction } from "express";
const bcrypt = require("bcryptjs");
const User = require("../models/user");
import { IUser } from "../models/user";
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

// SIGNUP route to generate JWT token
exports.signup = [
	// sanitize the body
	body("username", "Username required").trim().notEmpty().escape(),
	body("email", "Invalid email").trim().notEmpty().escape(),
	body("password", "Invalid password").trim().notEmpty().escape(),
	body("password_confirm", "Invalid password").trim().notEmpty().escape(),

	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		const userExist = await User.findOne({ username: req.body.username });
		const emailExist = await User.findOne({ email: req.body.email });
		let errorMessages = [];

		// Check password confirmation
		if (!errors.isEmpty() || req.body.password !== req.body.password_confirm) {
			errorMessages.push("Passwords do not match, please try again.");
		}
		// Check if username already taken
		if (userExist) {
			errorMessages.push("Username taken, try another name.");
		}
		// Check if user's email already exist
		if (emailExist) {
			errorMessages.push("Email already registered. Try again.");
		}

		// If we have any error message because of the above
		if (errorMessages.length !== 0) {
			return res.json({
				username: req.body.username,
				email: req.body.email,
				errors: errors.array(),
				errorMessages,
			});
		}

		// Hash and salt the password and store it in database
		bcrypt.hash(req.body.password, 10, async (err: Error, hashedPassword: String) => {
			// Check if hashing error
			if (err) {
				console.error("Error hashing password:", err);
				return res.status(500).send("Internal Server Error");
			}

			let user = new User({
				username: req.body.username,
				email: req.body.email,
				password: hashedPassword,
				profile_img: "default",
				date_joined: new Date(),
				admin_access: false,
			});
			await user.save();

			// Create JWT Signature and send token to client side along with userInfo (to be saved locally)
			const token = jwt.sign({ userId: `${req.body.userId}` }, `${process.env.SECRET_KEY}`, { expiresIn: "1w" });
			return res.json({ token, user });
		});
	}),
];

// LOGIN route to generate JWT token
exports.login = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
	// Authenticate user login with local strategy if user exists.
	passport.authenticate("local", { session: false }, function (err: Error, user: IUser, info: any) {
		if (err) {
			return res.status(500).json({ error: "Internal Server Error" });
		}
		if (!user) {
			return res.status(401).json({ error: info.message });
		}

		// Send token to client side (to be saved locally)
		const token = jwt.sign({ user }, `${process.env.SECRET_KEY}`, { expiresIn: "1w" });
		return res.json({ token, user });
	})(req, res, next);
});

// LOGOUT route
exports.logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// Note that req.logout() usually used for sessions. local storage cleared client side instead
	console.log("Logout: redirecting back to home page.");
	res.redirect("/");
});
