const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mathematics_DEV/image_files", // Folder for images
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Storage for PDF files
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mathematics_DEV/pdf_files", // Folder for PDF files
    allowed_formats: ["pdf"],
  },
});

module.exports = { cloudinary, imageStorage, pdfStorage };
