import mongoose, {Schema} from 'mongoose';
import { DateTime } from "luxon";

interface IComments {
   username: String;
   likes: number;
   date_posted: Date;
}

const CommentSchema = new Schema ({
   username: {type: Schema.Types.ObjectId, ref: 'User', required: true},
   likes: {type: Number, default: 0},
   date_posted: { type: Date, default: Date.now, required: true },
})

CommentSchema.virtual('format_date').get(function(this: IComments) {
   return DateTime.fromJSDate(this.date_posted).toFormat('MMMM dd, yyyy');
})

module.exports = mongoose.model('Comment', CommentSchema);