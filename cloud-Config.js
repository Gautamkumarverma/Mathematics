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
  params: async (req, file) => {
    const timestamp = Date.now();
    const originalNameWithoutExt = file.originalname.split(".")[0]; // Remove extension
    const extension = file.mimetype === "application/pdf" ? "pdf" : ""; // Add .pdf for PDFs
    return {
      folder: "mathematics_DEV",
      resource_type: "raw",
      public_id: `${originalNameWithoutExt}.${extension}`, // Add .pdf explicitly
      allowed_formats: ["pdf", "png", "jpg", "jpeg"],
    };
  },
});


module.exports = { cloudinary, storage };