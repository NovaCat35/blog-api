const LocalStrategy = require("passport-local").Strategy;
const jwtStrategy = require("./strategies/jwt");
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ExtractJwt = require("passport-jwt").ExtractJwt;

type DoneFunction = (err: Error | null, user?: any | false, info?: any) => void;

// Setting up the LocalStrategy (AUTHENTICATION)
passport.use(
	new LocalStrategy(async (username: string, password: string, done: DoneFunction) => {
		try {
			const user = await User.findOne({ username: username });
			if (!user) {
				return done(null, false, { message: "Incorrect username." });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: "Incorrect password." });
			}
			return done(null, user);
		} catch (err) {
			return done(err as Error);
		}
	})
);

// Setting up the JWTStrategy (AUTHORIZATION)
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
	new jwtStrategy(opts, async (jwt_payload: { username: string }, done: DoneFunction) => {
		try {
			const user = await User.findOne({ username: jwt_payload.username });
			if (user) {
				return done(null, true);
			} else {
				return done(null, false);
			}
		} catch (err) {
			return done(err as Error, false);
		}
	})
);
