import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	//Mock user
	const user = {
		id: 1,
		username: "rob",
		email: "brad@gmail.com",
	};

   // Note the token we send to the client side must be saved locally
	jwt.sign({ user }, `${process.env.SECRET_KEY}`, {expiresIn: '1w'}, (err: Error, token: string) => {
		res.json({
			token,
         secret: process.env.SECRET_KEY
		});
	});
});

exports.logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});
