const multer = require("multer");

/**
 * MemoryStorage for images:
 * Temporarily stores the uploaded files in memory before being processed & moved to Cloudinary.
 * 
 * VS
 * 
 * DiskStorage for images:
 * Temporarily stores the uploaded files on the server's memoryStorage. 
 * The public/uploads directory is the destination where these files are stored temporarily before being processed & moved to Cloudinary.
 */

// MemoryStorage IS NOT WORKING FOR SOME REASON ...
// const storage = multer.memoryStorage();
// const fileUploader = multer({ storage });
// module.exports =  fileUploader;

// USING DiskStorage instead
const storage = multer.diskStorage({
	destination: function (req: any, file: File, cb: any) {
		cb(null, "public/uploads");  
	},
});
const fileUploader = multer({ storage: storage });
module.exports =  fileUploader;
