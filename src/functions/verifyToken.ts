import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
	token?: string;
	user?: {
		_id: string;
		username: string;
		email: string;
		profile_img: string;
		date_joined: string;
		admin_access: boolean;
	 };
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
