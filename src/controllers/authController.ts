import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
import { IUser } from "../models/user";
const { body, validationResult } = require("express-validator");

exports.signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   // email
})


// Login route to generate JWT token
exports.login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("local", function (err: Error, user: IUser, info: any) {
		if (err) {
			// Issue occurred with authentication
			return next(err);
		}

		if (!user) {
			// Authentication failed, no user found. Return to login page with error message (info.message)
			return res.json({
				message: "Authentication failed.",
				username: req.body.username,
				error: info.message, 
			});
		}

		// Note the token we send to the client side must be saved locally
		const token = jwt.sign({ userId: `${req.body.userId}` }, `${process.env.SECRET_KEY}`, { expiresIn: "1w" });
      return res.json({ token });
	});
});

exports.logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// Note that req.logout() usually used for sessions. local storage cleared client side instead
	console.log("Logout: redirecting back to home page.");
   res.redirect('/');
});
