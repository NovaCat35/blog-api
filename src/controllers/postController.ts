import { Request, Response, NextFunction } from "express";
const Blog = require("../models/blogPost");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
import { AuthRequest } from "../functions/verifyToken";

exports.homepage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	res.json({
		message: "Welcome to the API",
	});
});

exports.posts_get = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	res.json({
		message: "Show blog posts",
	});
});

exports.create_post = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
	jwt.verify(req.token, `${process.env.SECRET_KEY}`, (err: Error, authData: any) => {
      console.log(`this is token: ${req.token}`)
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				message: "Blog post created...",
            authData
			});
		}
	});
});
