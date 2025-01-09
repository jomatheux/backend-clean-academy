import sequelize from '../config/db.js'; // Conexão com o banco
import User from './User.js';
import Course from './Course.js';
import Video from './Video.js';
import UserCourse from './UserCourse.js';
import Report from './Report.js';
import Test from './Test.js';

// Configurar associações
User.belongsToMany(Course, { through: UserCourse, foreignKey: 'userId', as: 'courses' });
Course.belongsToMany(User, { through: UserCourse, foreignKey: 'courseId', as: 'users' });

// Relacionamento
Course.hasMany(Video, { foreignKey: 'courseId', as: 'videos' });
Video.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Test.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Course.hasOne(Test, { foreignKey: 'courseId', as: 'test' });

Report.belongsTo(Test, { foreignKey: 'testId', as: 'test' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'users' });


// User.associate = function (models) {
//     User.hasMany(models.UserCourse, { as: 'userCourses', foreignKey: 'userId' });
// };

// UserCourse.associate = function (models) {
//     UserCourse.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
//     UserCourse.belongsTo(models.Course, { as: 'course', foreignKey: 'courseId' });
// };

// Course.associate = function (models) {
//     Course.hasMany(models.UserCourse, { as: 'userCourses', foreignKey: 'courseId' });
// };


// Exportar os modelos e a instância do Sequelize
export { sequelize, User, Course, UserCourse, Video };