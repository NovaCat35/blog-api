import mongoose, { Schema } from "mongoose";
import { DateTime } from "luxon";

interface IComments {
	_id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	blog_post: Schema.Types.ObjectId;
	text: String;
	likes: Schema.Types.ObjectId[]; // List of user IDs who liked the comment
	date_posted: Date;
	replies: IComments[];
	edited: Boolean;
}

const CommentSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	blog_post: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
	text: { type: String, required: true },
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	date_posted: { type: Date, default: Date.now, required: true },
	replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	edited: { type: Boolean, default: false },
});

CommentSchema.virtual("format_date").get(function (this: IComments) {
	return DateTime.fromJSDate(this.date_posted).toFormat("MMMM dd, yyyy");
});

module.exports = mongoose.model("Comment", CommentSchema);
