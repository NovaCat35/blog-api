import mongoose, { Schema } from "mongoose";
import { DateTime } from "luxon";

interface IComments {
	user: Schema.Types.ObjectId;
	blog_post: Schema.Types.ObjectId;
	comment: String;
	likes: number;
	date_posted: Date;
	replies: String[];
}

const CommentSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	blog_post: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
	comment: { type: String, required: true },
	likes: { type: Number, default: 0 },
	date_posted: { type: Date, default: Date.now, required: true },
	replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

CommentSchema.virtual("format_date").get(function (this: IComments) {
	return DateTime.fromJSDate(this.date_posted).toFormat("MMMM dd, yyyy");
});

module.exports = mongoose.model("Comment", CommentSchema);
