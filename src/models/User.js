import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { hash } from 'bcryptjs';

// Define the User model
const User = sequelize.define(
	'User',
	{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM('teacher', 'student'),
			allowNull: false,
		},
	},
	{
		tableName: 'users',
	}
);

// Hash the password before saving
User.beforeCreate(async (user) => {
	user.password = await hash(user.password, 10);
});

export default User;
