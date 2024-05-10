/**
 * This script populates and update some stuff to the database.
 * Specified database as argument - e.g.: node updateNpopulate
 * NOTE: run "npx tsc" to convert TS !!!!!!!
 */
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Blog = require("./dist/src/models/blogPost"); // run "npx tsc" to convert TS files to JS in 'dist' folder
main().catch((err) => console.log(err));

async function main() {
	console.log("Debug: About to connect");
	const mongoDB = process.env.MONGODB_DEV_URL;
	await mongoose.connect(`${mongoDB}`);
	console.log("Debug: Connected successfully");

	await updateBlogImageField();

	console.log("Debug: Closing mongoose");
	mongoose.connection.close();
}

// Update the blog_img field and other fields I haven't inserted in originally (aka I did some default documents through postman)
async function updateBlogImageField() {
	try {
		// Personal Mistake (field changes) Unset the old blog_img field
		const unsetOldField = await Blog.updateMany(
			{ blog_img: { $exists: true } }, // Find documents where blog_img exists (old structure)
			{ $unset: { blog_img: "" } } // Unset the old blog_img field
		);

		// Personal Mistake (need to delete all lone cloudinary_id field) 
		const unsetField = await Blog.updateMany(
			{ cloudinary_id: { $exists: true } }, // Find documents where cloudinary_id exists
			{ $unset: { cloudinary_id: "" } } // Unset the cloudinary_id field
	  );

		// Set the new structure for blog_img
		const setNewField = await Blog.updateMany(
			{},
			{
				$set: {
					"blog_img.img_url": "default",
					"blog_img.cloudinary_id": "default",
					"blog_img.src.name": "unsplash",
					"blog_img.src.link": "https://unsplash.com/", // or whatever default link you want
				},
			}
		);

		console.log(`${unsetOldField.nModified} blog(s) updated by unsetting old blog_img.`);
		console.log(`${setNewField.nModified} blog(s) updated with default images.`);
	} catch (err) {
		console.error("Error updating blog image fields:", err);
	}
}
