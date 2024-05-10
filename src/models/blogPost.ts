import mongoose, { Schema } from "mongoose";
import { DateTime } from "luxon";

interface IBlog {
	_id: any;
	tags: String[];
	read_time: number;
	date_posted: Date;
	title: String;
	content: String;
	blog_img: {
		img_url: String;
		cloudinary_id: String;
		src: {
			name: String;
			link: String;
		};
	};
	author: Schema.Types.ObjectId;
	comments: Schema.Types.ObjectId[];
	published: boolean;
	likes: Number;
}

const BlogSchema = new Schema({
	tags: [{ type: String, required: true }],
	read_time: { type: Number, required: true },
	date_posted: { type: Date, default: Date.now, required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	blog_img: {
		img_url: { type: String, default: "default", required: true },
		cloudinary_id: { type: String, default: "default", required: true },
		src: {
			name: { type: String, default: "unsplash", required: true },
			link: { type: String, default: "https://unsplash.com/", required: true },
		},
	},
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	published: { type: Boolean, default: false, required: true },
	likes: { type: Number, default: 0 },
});

BlogSchema.virtual("url").get(function (this: IBlog) {
	return `/blogs/${this._id}`;
});

BlogSchema.virtual("format_date").get(function (this: IBlog) {
	return DateTime.fromJSDate(this.date_posted).toFormat("MMMM dd, yyyy");
});

BlogSchema.virtual("format_date").get(function (this: IBlog) {
	return DateTime.fromJSDate(this.date_posted).toFormat("MMMM dd, yyyy");
});

module.exports = mongoose.model("Blog", BlogSchema);
