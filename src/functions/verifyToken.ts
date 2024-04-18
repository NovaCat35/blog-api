import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
	token?: string;
}

/**
 * FORMAT OF TOKEN
 * Authorization: Bearer <access_token>
 **/

function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
	// Get auth header value
	const bearerHeader = req.headers["authorization"];

   if (typeof bearerHeader !== "undefined") {
		// Split at the space
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		// Set the token
		req.token = bearerToken;

		next();
	} else {
		// Forbidden
		res.sendStatus(403);
	}
}

module.exports = verifyToken;
