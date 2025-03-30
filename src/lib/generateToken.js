import jwt from 'jsonwebtoken';
export const generateTokenandSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });
    console.log("Generated Token:", token); // Log token to verify it matches what is sent
    return token;
};
