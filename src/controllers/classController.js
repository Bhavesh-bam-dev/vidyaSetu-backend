import Class from '../models/Class.js';
import User from '../models/User.js';

const getUserEmailById = async (id) => {
	const user = await User.findByPk(id);
	return user.email;
};

const getUserIdByEmail = async (email) => {
	const user = await User.findOne({ where: { email } });
	return user.id;
};

const getClientClassObj = async (dbClass) => {
	const clientClass = {
		classId: dbClass.id,
		title: dbClass.title,
		description: dbClass.description,
		owner: await getUserEmailById(dbClass.teacherId),
		students: await Promise.all(dbClass.enrolledStudents.map(async (studentId) => await getUserEmailById(studentId))),
		createdAt: dbClass.createdAt,
	};
	return clientClass;
};

export const createClass = async (req, res) => {
	try {
		const { title, description, students: studentEmails } = req.body;
		const teacherId = req.user.id;

		if (!Array.isArray(studentEmails) || studentEmails.length === 0) {
			return res.status(400).json({ error: 'Invalid student emails format' });
		}

		// Find student IDs from emails
		const students = await User.findAll({
			where: { email: studentEmails },
			attributes: ['id'],
		});

		//Find teacher Email
		const teacher = await getUserEmailById(teacherId);

		const studentIds = students.map((student) => student.id);

		// Create class with student IDs
		const newClass = await Class.create({ title, description, teacherId, enrolledStudents: studentIds });
		const clientClass = await getClientClassObj(newClass);
		console.log('New Class:', newClass);

		res.status(201).json(clientClass);
	} catch (error) {
		res.status(500).json({ error: 'Error creating class' });
	}
};

export const getStudentClasses = async (req, res) => {
	try {
		const userId = req.user.id;
		const userRole = req.user.userRole;

		let classes = null;
		if (userRole === 'student') {
			classes = await Class.findAll({
				where: { enrolledStudents: { [Op.contains]: [userId] } }, // Check if student is in enrolledStudents array
			});
		} else {
			classes = await Class.findAll({
				where: { teacherId: userId },
			});
		}

		const clientClasses = await Promise.all(classes.map(async (classObj) => await getClientClassObj(classObj)));
		res.status(200).json(clientClasses);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching classes' });
	}
};

export const getClassById = async (req, res) => {
	try {
		const { classId } = req.params;

		// Find class by ID
		const classData = await Class.findByPk(classId);

		if (!classData) {
			return res.status(404).json({ message: 'Class not found' });
		}

		const clientClass = await getClientClassObj(classData);

		res.status(200).json(clientClass);
	} catch (error) {
		console.error('Error fetching class:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const enrollMoreStudents = async (req, res) => {
	try {
		const { studentIds } = req.body;
		const { classId } = req.params;

		const existingClass = await Class.findByPk(classId);
		if (!existingClass) {
			return res.status(404).json({ error: 'Class not found' });
		}

		const updatedStudents = [...new Set([...existingClass.enrolledStudents, ...studentIds])];

		await existingClass.update({ enrolledStudents: updatedStudents });

		res.status(200).json({ message: 'Students enrolled successfully', enrolledStudents: updatedStudents });
	} catch (error) {
		res.status(500).json({ error: 'Error enrolling students' });
	}
};

export const removeStudentFromClass = async (req, res) => {
	try {
		const { studentEmail } = req.body;
		const { classId } = req.params;

		const studentId = await getUserIdByEmail(studentEmail);

		const existingClass = await Class.findByPk(classId);
		if (!existingClass) {
			return res.status(404).json({ error: 'Class not found' });
		}

		const updatedStudents = existingClass.enrolledStudents.filter((id) => id !== studentId);

		await existingClass.update({ enrolledStudents: updatedStudents });

		res.status(200).json({ message: 'Student removed successfully', existingClass });
	} catch (error) {
		res.status(500).json({ error: 'Error removing student' });
	}
};
export const updateClassDetails = async (req, res) => {
	try {
		const { classId } = req.params;
		const { title, description } = req.body;

		const existingClass = await Class.findByPk(classId);
		if (!existingClass) {
			return res.status(404).json({ error: 'Class not found' });
		}

		await existingClass.update({ title, description });

		const updatedClass = await getClientClassObj(existingClass);

		res.status(200).json(updatedClass);
	} catch (error) {
		res.status(500).json({ error: 'Error updating class details' });
	}
};
