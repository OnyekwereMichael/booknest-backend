import jwt from 'jsonwebtoken';

export const generateTokenandSetCookie = (userId, res) => {
    // Generate a JWT token with the user's ID
   jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });
};
