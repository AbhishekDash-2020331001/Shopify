import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });

    // Use asynchronous file deletion
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.log('Error deleting file:', err);
      }
    });

    return response;
  } catch (error) {
    // Handle errors while uploading
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.log('Error deleting file after failed upload:', err);
      }
    });
    console.log('File upload error on local server:', error);
    return null;
  }
};

export { uploadOnCloudinary };
