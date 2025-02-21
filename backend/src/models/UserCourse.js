import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Course from './Course.js';
import Video from './Video.js';

const UserCourse = sequelize.define('UserCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  progress: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0, // Progresso inicial é 0%
  },
  watchedVideos: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [], // Lista de vídeos assistidos
  },
}, {
  timestamps: true,
  tableName: 'tb_user_courses',
});

// UserCourse.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// UserCourse.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

UserCourse.belongsTo(User, { as: 'user', foreignKey: 'userId' },);
User.hasMany(UserCourse, { as: 'userCourses', foreignKey: 'userId' });

UserCourse.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });
Course.hasMany(UserCourse, { as: 'userCourses', foreignKey: 'courseId' });

export default UserCourse;