import { where } from 'sequelize';
import { User, Course, UserCourse } from '../models/associations.js'
import removeOldImage from '../helpers/removeOldImage.js'
import deleteObjectS3ByUrlV3MinIO from '../helpers/deleteObjectS3ByUrlV3MinIO.js';

class UserService {
    constructor(userModel, courseModel, userCourseModel) {
        this.userModel = userModel;
        this.courseModel = courseModel;
        this.userCourseModel = userCourseModel;
    }

    async createUserWithCourses(userData) {
        try {
            const newUser = await this.userModel.create(userData);
            console.log('Usuário criado com sucesso:', newUser);

            const courses = await this.courseModel.findAll();

            if (courses.length > 0) {
                const userCourseData = courses.map((course) => ({
                    userId: newUser.id,
                    courseId: course.id,
                    progress: 0,
                }));

                await this.userCourseModel.bulkCreate(userCourseData);
                console.log('Usuário criado e associado a todos os cursos com sucesso!');
            }

            return newUser;
        } catch (error) {
            console.error('Erro ao criar usuário e associá-lo aos cursos:', error);
            throw error;
        }
    }

    async deleteUserById(userId) {
        try {
            const user = await this.userModel.findByPk(userId);
            const deletedUser = user;
            const userCourse = await this.userCourseModel.findAll({ where: { userId: user.id } });
            if (user.image) {
                deleteObjectS3ByUrlV3MinIO(user.image);
            }
            if (user) {
                await user.destroy();
                await userCourse.map(uc => uc.destroy());
                return deletedUser;
            } else {
                console.log('Usuário não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
        }
    }
}

export default new UserService(User, Course, UserCourse);