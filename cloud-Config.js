const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage for images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mathematics_DEV",
    resource_type: "raw",
    allowed_formats: ["png", "jpg", "jpeg", "pdf"], // Allow both images and PDFs
  },
});

module.exports = { cloudinary, storage };
