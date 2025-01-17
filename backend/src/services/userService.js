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

const updateProgress = async (userId, courseId, newProgress) => {
  try {
    const userCourse = await UserCourse.findOne({ where: { userId, courseId } });
    if (userCourse) {
      userCourse.progress = newProgress;
      await userCourse.save();
      console.log('Progresso atualizado com sucesso!');
    } else {
      console.log('Relacionamento usuário-curso não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
  }
};

const getProgress = async (userId, courseId) => {
  try {
    const userCourse = await UserCourse.findOne({ where: { userId, courseId } });
    if (userCourse) {
      console.log(`Progresso do usuário: ${userCourse.progress}%`);
      return userCourse.progress.toString();
    } else {
      console.log('Relacionamento usuário-curso não encontrado.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter progresso:', error);
  }
};

const getUsersProgress = async () => {
  try {
    const usersProgress = await User.findAll({
      attributes: ['id', 'name'], // Seleciona o ID e o nome do usuário
      include: [
        {
          model: UserCourse,
          as: 'userCourses',
          attributes: ['progress'], // Seleciona o progresso nos cursos
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['title'], // Seleciona o título do curso
            },
          ],
        },
      ],
    });
    // Seleciona o total de cursos existentes
    const totalCourses = await Course.findAll();

    // Processa os dados para calcular o número de cursos completos e incompletos
    const formattedProgress = usersProgress.map(user => {
      const completedCourses = user.userCourses.filter(uc => uc.progress === 100).length;
      const tc = totalCourses.length;

      return {
        id: user.id,
        name: user.name,
        progress: `${completedCourses}/${tc}`, // Formato desejado
      };
    });

    return formattedProgress;
  } catch (error) {
    console.error('Erro ao recuperar o progresso dos usuários:', error);
    throw error;
  }
}

export { createUserWithCourses, updateProgress, getProgress, getUsersProgress };