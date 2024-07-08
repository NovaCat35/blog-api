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
const storage = multer.memoryStorage();
const uploads = multer({ storage });
module.exports =  uploads;
