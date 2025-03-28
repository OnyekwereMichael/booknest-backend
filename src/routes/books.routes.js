import express from "express";
import { createBooks, deleteBooks, getBooks, getRecommendedBook } from "../controllers/books.controller.js";
import protectRoute from "../lib/middleware/protectRoute.js";

const router = express.Router();

router.get('/',  getBooks);
router.get('/user', protectRoute, getRecommendedBook);
router.post('/', protectRoute, createBooks);
router.delete('/:id',  deleteBooks);
// router.post('/login', login);
// router.post('/logout', logout); 

export default router;