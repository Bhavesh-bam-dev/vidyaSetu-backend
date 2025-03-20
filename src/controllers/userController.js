import User from '../models/User.js'; // Assuming User model exists

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
