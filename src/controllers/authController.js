import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { compare } from 'bcryptjs';
import User from '../models/User.js';
import { config } from 'dotenv';

config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

//User Fields in Table
// id
// email
// password
// role

// Register a new user
const register = async (req, res) => {
	const { email, password, role } = req.body;

	console.log('---------------Registration request:', email, password, role);

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({
				error: 'Email Already In Use',
				code: 'EMAIL_ALREADY_EXISTS',
				field: 'email',
			});
		}

		// Create new user
		const user = await User.create({ email, password, role });

		const responseUser = {
			id: user.id,
			role: user.role,
			email: user.email,
		};
		res.status(201).json({ message: 'User registered successfully', user: responseUser });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

// Login user
const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({
				error: 'User does not exists',
				code: 'USER_DOES_NOT_EXISTS',
			});
		}

		// Compare password
		const isMatch = await compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: 'Password is not matching', code: 'PASSWORD_NOT_MATCHING' });
		}

		// Generate JWT token
		const payload = { userId: user.id, email: user.email };
		const token = sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

		res.json({
			message: 'Login successful',
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				token: token,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

export default { register, login };
