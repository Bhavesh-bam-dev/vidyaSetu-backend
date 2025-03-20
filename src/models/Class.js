import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Class = sequelize.define('Class', {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.TEXT },
	teacherId: { type: DataTypes.INTEGER, allowNull: false },
	enrolledStudents: {
		type: DataTypes.ARRAY(DataTypes.INTEGER), // Store student IDs as an array
		defaultValue: [],
	},
});

Class.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

export default Class;
