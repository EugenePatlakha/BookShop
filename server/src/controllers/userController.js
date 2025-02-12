const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class UserController {
    static async registerUser(req, res) {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        try {
            const existingUser = await UserModel.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            await UserModel.addUser({ firstName, lastName, email, passwordHash });

            const token = jwt.sign(
                { firstName, email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({ 
                message: 'User registered successfully', 
                token,
                user: { firstName: firstName, lastName: lastName } 
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async loginUser(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('asdsadas');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            const user = await UserModel.getUserByEmail(email);

            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { userId: user.userId, email: user.email, isAdmin: user.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token,
                user: { firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin },
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = UserController;

