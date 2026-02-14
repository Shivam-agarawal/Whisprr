import jwt from 'jsonwebtoken';


export const generateToken = (newUser, res) => {

    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, {
        httpOnly: true, // Cookie is only accessible by the server // Helps prevent XSS attacks //cross-site scripting attacks
        sameSite: 'strict', // Cookie is only sent in a first-party context // Helps prevent CSRF attacks //cross-site request forgery attacks
        secure: process.env.NODE_ENV === 'production'? true : false, // Cookie is only sent over HTTPS in production // Helps ensure secure transmission of the token // In development, it can be sent over HTTP for easier testing
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
    return token;
};