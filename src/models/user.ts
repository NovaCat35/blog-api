import mongoose, { Schema } from "mongoose";
import {DateTime} from "luxon";

export interface IUser {
   _id: any;
	username: string;
	email: string;
	password: string;
	profile_img: string;
   cloudinary_id: string;
	date_joined: Date;
   admin_access: boolean;
}

const UserSchema = new Schema({
	username: { type: String, required: true },
   password: {type: String, required: true},
	profile_img: String,
	cloudinary_id: String,
	date_joined: { type: Date, default: Date.now, required: true },
   admin_access: {type: Boolean, default: false, required: true},
})

UserSchema.virtual('url').get(function(this: IUser) {
   return `/users/${this._id}`
})

UserSchema.virtual("format_date").get(function (this: IUser) {
	return DateTime.fromJSDate(this.date_joined).toFormat('MMMM dd, yyyy')	
});

module.exports = mongoose.model('User', UserSchema);