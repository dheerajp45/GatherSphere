import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export {
  PORT,
  JWT_SECRET,
  MONGODB_URI,
  EMAIL,
  APP_PASSWORD,
  FRONTEND_URL,
};
