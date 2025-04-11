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
Video.belongsTo(Course, { foreignKey: 'courseId', as: 'courses' });

Course.hasMany(Product, { foreignKey: 'courseId', as: 'products' });
Product.belongsTo(Course, { foreignKey: 'courseId', as: 'courses' });

Test.belongsTo(Course, { foreignKey: 'courseId', as: 'courses' });
Course.hasOne(Test, { foreignKey: 'courseId', as: 'tests' });

Report.belongsTo(Test, { foreignKey: 'testId', as: 'tests' });
Test.hasMany(Report, { foreignKey: 'testId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'users' });


// Exportar os modelos e a instância do Sequelize
export { sequelize, User, Course, UserCourse, Video, Product, Test, Report };