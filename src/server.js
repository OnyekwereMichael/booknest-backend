import express from "express";
import dotenv from 'dotenv'
const app = express();
import userRoutes from './routes/user.routes.js'
import bookRoutes from './routes/books.routes.js'
import { connectDB } from "./lib/db/connectMongoDb.js";
import cors from 'cors';

dotenv.config()
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// this is used to parse cookies from the request headers in the req.cookies.
// app.use(cookieParser())

// CORS Configuration
const corsOptions = {
    origin:['https://twit-flash-q7bo.vercel.app', "https://twit-flash-g3q9.vercel.app", "http://localhost:8081" ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,
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