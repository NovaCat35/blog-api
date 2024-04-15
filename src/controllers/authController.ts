import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Login route to generate JWT token
exports.login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	//Mock user
	const user = {
		id: 1,
		username: "rob",
		email: "brad@gmail.com",
	};

	// Note the token we send to the client side must be saved locally
	jwt.sign({ userId: `${req.params.id}` }, `${process.env.SECRET_KEY}`, { expiresIn: "1w" }, (err: Error, token: string) => {
		res.json({token});
	});
});

exports.logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});
