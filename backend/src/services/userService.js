import { where } from 'sequelize';
import { User, Course, UserCourse } from '../models/associations.js'

const createUserWithCourses = async (userData) => {
  try {
    // Cria o usuário
    const newUser = await User.create(userData);
    console.log('Usuário criado com sucesso:', newUser);

    // Busca todos os cursos
    const courses = await Course.findAll();

    // Cria o relacionamento entre o usuário e os cursos
    const userCourseData = courses.map((course) => ({
      userId: newUser.id,
      courseId: course.id,
      progress: 0, // Progresso inicial
    }));

    await UserCourse.bulkCreate(userCourseData);

    console.log('Usuário criado e associado a todos os cursos com sucesso!');
    return newUser;
  } catch (error) {
    console.error('Erro ao criar usuário e associá-lo aos cursos:', error);
    throw error;
  }
};

const deleteUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    const deletedUser = user;
    const userCourse = await UserCourse.findAll({ where: { userId: user.id } });
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

export { createUserWithCourses, deleteUserById };