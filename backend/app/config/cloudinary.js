import dotenv from 'dotenv'
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// console.log("Cloudinary:",process.env.CLOUDINARY_API_KEY)
// console.log("Cloudinary:",process.env.CLOUDINARY_API_SECRET)
// console.log("Cloudinary:",process.env.CLOUDINARY_CLOUD_NAME)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("After config:", cloudinary.config());

export default cloudinary;