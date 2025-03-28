import express from "express";
import dotenv from 'dotenv'
const app = express();
import userRoutes from './routes/user.routes.js'
import bookRoutes from './routes/books.routes.js'
import { connectDB } from "./lib/db/connectMongoDb.js";
import cors from 'cors';
import job from "./lib/cron/cron.js";
import { v2 as cloudinary } from 'cloudinary';
// import cookieParser from "cookie-parser";

dotenv.config()
job.start()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())
// this is used to parse cookies from the request headers in the req.cookies.


// CORS Configuration
const corsOptions = {
    origin:["http://localhost:8081" ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
// Apply CORS middleware
app.use(cors(corsOptions));
app.use('/api/auth', userRoutes);
app.use('/api/book', bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})