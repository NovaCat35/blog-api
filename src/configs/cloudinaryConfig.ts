require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const result = await cloudinary.uploader.upload(req.file.path, { folder: "blog_posts/main_blog_images" });

async function handleUpload(file: string) {
	const res = await cloudinary.uploader.upload(file, { folder: "blog_posts/main_blog_images" })
	return res;
}


async function handleDelete(cloudinaryId: string) {
	const res = await cloudinary.uploader.destroy(cloudinaryId, { folder: "blog_posts/main_blog_images" })
	return res;
}

module.exports = { handleUpload, handleDelete };
