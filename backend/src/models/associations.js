import sequelize from '../config/db.js'; // Conexão com o banco
import User from './User.js';
import Course from './Course.js';
import Video from './Video.js';
import UserCourse from './UserCourse.js';
import Report from './Report.js';
import Test from './Test.js';
import Product from './Product.js';

// Configurar associações
User.belongsToMany(Course, { through: UserCourse, foreignKey: 'userId', as: 'courses' });
Course.belongsToMany(User, { through: UserCourse, foreignKey: 'courseId', as: 'users' });

// Relacionamento
Course.hasMany(Video, { foreignKey: 'courseId', as: 'videos' });
Video.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Course.hasMany(Product, { foreignKey: 'courseId', as: 'products' });
Product.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Test.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Course.hasOne(Test, { foreignKey: 'courseId', as: 'test' });

Report.belongsTo(Test, { foreignKey: 'testId', as: 'test' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'users' });


// Exportar os modelos e a instância do Sequelize
export { sequelize, User, Course, UserCourse, Video, Product, Test, Report };