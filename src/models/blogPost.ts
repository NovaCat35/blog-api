import mongoose, { Schema } from "mongoose";
import {DateTime} from "luxon";

interface IBlog {
   _id: any;
	tags: String[];
   read_time: number;
   date_created: Date;
	title: String;
	texts: String;
	blog_img: String;
   cloudinary_id: String;
   author: string;
   comments: String[];
   published: boolean;
}

const BlogSchema = new Schema({
	tags: [{ type: String }],
   read_time: { type: Number, required: true },
   date_posted: { type: Date, default: Date.now, required: true },
	title: { type: String, required: true },
	texts: { type: String, required: true },
	blog_img: String,
   cloudinary_id: String,
   author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   comments: [{ type: String, ref: 'Comment' }],
   published: {type: Boolean, default: false, required: true},
})

BlogSchema.virtual('url').get(function(this: IBlog) {
   return `/blogs/${this._id}`
})

BlogSchema.virtual("format_date").get(function (this: IBlog) {
	return DateTime.fromJSDate(this.date_created).toFormat('MMMM dd, yyyy')	
});

module.exports = mongoose.model('Blog', BlogSchema)