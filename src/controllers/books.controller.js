import cloudinary from "../lib/cloudinary/cloudinary.js";
import Book from '../models/book.models.js'
export const createBooks = async (req, res) => {
  try {
    const { title, caption, publishYear, image, rating } = req.body;
     if(!title || !caption || !publishYear || !image || !rating) {
         return res.status(400).json({ error: 'All fields are required' });
     }
  
    //  upload image to cloudinary 
    const uploadResponse = await cloudinary.uploader.upload(image)
    const imageUrl = uploadResponse.secure_url

    // save response 

  const newBook = new Book({
     title,
    caption,
    rating,
    publishYear,
    image: imageUrl,
    user: req.user?._id
  })

   await newBook.save()
   res.status(201).json({ message: 'Book created successfully!', book: newBook });
  } catch (error) {
     console.log('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .populate('user', 'username profileImg')
    const totalBooks = await Book.countDocuments();

    res.status(200).json({ books, totalBooks, currentPage: page, totalPages: Math.ceil(totalBooks / limit) });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteBooks = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if(!book) {
     return res.status(404).json({ error: 'Book not found' });
    }
 
   //  check if the user is the owner of the book
    if(book.user.toString() !== req.user._id.toString()){
      return res.status(403).json({ error: 'You are not authorized to delete this book' });
    }

    // delete image from cloudinary
    if(book.image && book.image.includes('cloudinary')) {
      const publicId = book.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
 
    await book.deleteOne()
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getRecommendedBook = async (req, res) => {
  try {
     const books = await Book.find({user: req.user?._id}).sort({createdAt: -1})
     res.status(200).json({ books });
  } catch (error) {
     console.log('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}