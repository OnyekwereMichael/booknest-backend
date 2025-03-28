import bcrypt from 'bcryptjs';
import User from '../models/user.models.js';
import { generateTokenandSetCookie } from '../lib/generateToken.js';
export const register = async (req, res) => {
    try {
        const { username, email, password} = req.body;

   if(!username || !email || !password ) {
            return res.status(400).json({ error: 'All fields are required' });
 }

// Validate email format
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
}

// Check if username already exists
const userNameExist = await User.findOne({ username });
if (userNameExist) {
    return res.status(400).json({ error: 'Username already exists' });
}

if(username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
}

// Check if email already exists
const userEmailExist = await User.findOne({ email });
if (userEmailExist) {
    return res.status(400).json({ error: 'Email already exists' });
}

// Hash the password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const profileImg = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
// Create a new user in the database
const user = await User.create({
    username,
   email,
    profileImg,
    password: hashedPassword,
});

if (user) {
    // Generate a JWT token and set it as a cookie
    const token = generateTokenandSetCookie(user._id, res);

    // Save the user and respond with user details
    await user.save();
    res.status(201).json({
       token,
       user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        createdAt: user.createdAt
       }
    });
} else {
    res.status(400).json({ error: 'Invalid user data' });
}
   } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
   if(!email || !password) {
    return res.status(400).json({ error: 'Email or Password are required' });
}
    const user = await User.findOne({ email });;
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateTokenandSetCookie(user._id, res);

    res.status(200).json({
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            createdAt: user.createdAt
        }
    });
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
       }
}

export const logout = async (req, res) => {
    try {
         res.cookie("jwt", "", {maxage:0})
         res.status(200).json({message: 'Logged out successfully'})
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}