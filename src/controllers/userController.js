import User from '../models/User.js'; // Assuming User model exists
import { Op } from 'sequelize';

export const checkStudentExists = async (req, res) => {
	try {
		// Ensure only teachers can access this API
		if (req.user.role !== 'teacher') {
			return res.status(403).json({ error: 'Access denied. Only teachers can perform this action.' });
		}

		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ error: 'Email is required' });
		}

		// Find user by email and check if role is 'student'
		const student = await User.findOne({ where: { email, role: 'student' } });

		if (student) {
			return res.status(200).json({ exists: true, message: 'Student exists' });
		} else {
			return res.status(200).json({ exists: false, message: 'Student not found' });
		}
	} catch (error) {
		console.error('Error checking student:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getStudentSuggestions = async (req, res) => {
	try {
		// Ensure only teachers can access this API
		if (req.user.role !== 'teacher') {
			return res.status(403).json({ error: 'Access denied. Only teachers can perform this action.' });
		}

		const { keyword } = req.query;

		if (!keyword) {
			return res.status(400).json({ error: 'Keyword is required' });
		}

		// Find students whose email contains the keyword
		const students = await User.findAll({
			where: {
				email: {
					[Op.like]: `%${keyword}%`,
				},
				role: 'student',
			},
		});

		const emails = students.map((student) => student.email);

		return res.status(200).json({ emails });
	} catch (error) {
		console.error('Error fetching student emails:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
