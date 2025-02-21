import { where } from 'sequelize';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCourse from '../models/UserCourse.js';
import Video from '../models/Video.js';


const createCourseWithUsers = async (courseData) => {
  try {
    // Cria o curso
    const newCourse = await Course.create(courseData);

    // Busca todos os usuários
    const users = await User.findAll();

    // Cria o relacionamento entre o curso e os usuários
    const userCourseData = users.map((user) => ({
      userId: user.id,
      courseId: newCourse.id,
      progress: 0, // Progresso inicial
    }));

    await UserCourse.bulkCreate(userCourseData);

    console.log('Curso criado e associado a todos os usuários com sucesso!');
    return newCourse;
  } catch (error) {
    console.error('Erro ao criar curso e associá-lo aos usuários:', error);
    throw error;
  }
};

const getCoursesWithProgressByUserId = async (userId) => {
  console.log('Buscando cursos do usuário com ID:', userId);
  try {
    const userCourses = await UserCourse.findAll({
      where: { userId }, // Filtra pelo ID do usuário na tabela intermediária
      include: [
        {
          model: Course,
          as: 'course', // Nome do alias na relação
          attributes: ['id', 'title', 'description'], // Campos que queremos do modelo Course
        },
      ],
    });

    if (userCourses.length === 0) {
      return { error: 'Nenhum curso encontrado para este usuário.' };
    }

    // Retorna os cursos com o progresso
    return userCourses.map((userCourse) => ({
      courseId: userCourse.course.id,
      title: userCourse.course.title,
      description: userCourse.course.description,
      progress: userCourse.progress,
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    throw error;
  }
};

const getCourseWithVideos = async (courseId) => {
  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Video,
          as: 'videos',
          attributes: ['id', 'title', 'url', 'duration', 'image'], // Campos que deseja retornar
        },
      ],
    });

    if (!course) {
      return { error: 'Curso não encontrado.' };
    }

    return course;
  } catch (error) {
    console.error('Erro ao buscar vídeos do curso:', error);
    throw error;
  }
}


const addVideoToCourse = async (courseId, videoData) => {
  try {
    const newVideo = await Video.create({
      ...videoData,
      courseId,
    });
    // Atualiza o progresso do curso
    try {
      // Verifica se o relacionamento usuário-curso existe e guarda ele em uma variável
      const userCourse = await UserCourse.findAll({ where: { courseId } });
      if (!userCourse) {
        console.log('Relacionamento usuário-curso não encontrado.');
        return;
      }
      // Verifica se o vídeo existe
      const video = await Video.findByPk(newVideo.id);
      if (!video) {
        console.log('Vídeo não encontrado.');
        return;
      }
      // Atualiza o progresso no relacionamento usuário-curso
      if (userCourse) {
        userCourse.forEach(async (uc) => {
          // Busca o curso com os vídeos para calcular o progresso atual
          const courseWithVideos = await getCourseWithVideos(courseId);
          const totalVideos = courseWithVideos.videos.length;
          const completedVideos = uc.watchedVideos.length;
          // Calcula o novo progresso do curso e atualiza o relacionamento
          const newProgress = Math.round((completedVideos / totalVideos) * 100);
          console.log(`Novo progresso: ${newProgress}%`);
          uc.progress = newProgress;
          await uc.save();
        });

        console.log('Progresso atualizado com sucesso!');
      } else {
        console.log('Relacionamento usuário-curso não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }

    console.log('Vídeo adicionado com sucesso:', newVideo);

    return newVideo;
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    throw error;
  }
};

const deleteVideo = async (videoId) => {
  try {
    const video = await Video.findByPk(videoId);
    if (!video) {
      console.log('Vídeo não encontrado.');
      return;
    }
    const courseId = video.courseId;
    // Verifica se o relacionamento usuário-curso existe e guarda ele em uma variável
    const userCourse = await UserCourse.findAll({ where: { courseId } });
    if (!userCourse) {
      console.log('Relacionamento usuário-curso não encontrado.');
      return;
    }
    // Deleta o vídeo
    await video.destroy();
    console.log('Vídeo deletado com sucesso!');
    // Atualiza o progresso do curso
    try {
      // Atualiza o progresso no relacionamento usuário-curso
      if (userCourse) {
        // Busca o curso com os vídeos para calcular o progresso atual
        userCourse.forEach(async (uc) => {
          // Verifica se o video deletado estava na lista de videos assistidos
          if (uc.watchedVideos.includes(videoId)) {
            // Remove o video deletado da lista de videos assistidos
            uc.watchedVideos = uc.watchedVideos.filter(v => v !== videoId);
          }
          // Busca o curso com os vídeos para calcular o progresso atual
          const courseWithVideos = await getCourseWithVideos(courseId);
          const totalVideos = courseWithVideos.videos.length;
          const completedVideos = uc.watchedVideos.length;
          // Calcula o novo progresso do curso e atualiza o relacionamento
          const newProgress = Math.round((completedVideos / totalVideos) * 100);
          console.log(`Novo progresso: ${newProgress}%`);
          uc.progress = newProgress;
          await uc.save();
        });

        console.log('Progresso atualizado com sucesso!');
      } else {
        console.log('Relacionamento usuário-curso não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
    //Retorna o video deletado
    return video;
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
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

const getUserProgressInCoursesByUserId = async (userId) => {
  console.log('Buscando cursos do usuário com ID:', userId);
  try {
    const userCourses = await UserCourse.findAll({
      where: { userId }, // Filtra pelo ID do usuário na tabela intermediária
      include: [
        {
          model: Course,
          as: 'course', // Nome do alias na relação
          attributes: ['id', 'title', 'description'], // Campos que queremos do modelo Course
        },
      ],
    });

    if (userCourses.length === 0) {
      return { error: 'Nenhum curso encontrado para este usuário.' };
    }

    // Retorna os cursos com o progresso
    return userCourses.map((userCourse) => ({
      courseId: userCourse.course.id,
      title: userCourse.course.title,
      description: userCourse.course.description,
      progress: userCourse.progress,
      whatchedVideos: userCourse.watchedVideos,
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    throw error;
  };
};

const updateProgress = async (userId, courseId, videoId) => {
  try {
    // Verifica se o relacionamento usuário-curso existe e guarda ele em uma variável
    const userCourse = await UserCourse.findOne({ where: { userId, courseId } });
    if (!userCourse) {
      console.log('Relacionamento usuário-curso não encontrado.');
      return;
    }
    // Verifica se o vídeo existe
    const video = await Video.findByPk(videoId);
    if (!video) {
      console.log('Vídeo não encontrado.');
      return;
    }
    // Coloca o vídeo como assistido na tabela de relacionamento
    const watchedVideos = userCourse.watchedVideos;
    if (!watchedVideos.includes(videoId)) {
      watchedVideos.push(videoId);
      userCourse.watchedVideos = watchedVideos;
      userCourse.changed('watchedVideos', true); // Marca o campo como alterado
      await userCourse.save();
    }

    // Busca o curso com os vídeos para calcular o progresso atual
    const courseWithVideos = await getCourseWithVideos(courseId);
    const totalVideos = courseWithVideos.videos.length;
    const completedVideos = userCourse.watchedVideos.length;
    // Calcula o novo progresso do curso e atualiza o relacionamento
    const newProgress = Math.round((completedVideos / totalVideos) * 100);
    console.log(`Novo progresso: ${newProgress}%`);
    // Atualiza o progresso no relacionamento usuário-curso
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

export { createCourseWithUsers, getCoursesWithProgressByUserId, getCourseWithVideos, addVideoToCourse, deleteVideo, getProgress, getUsersProgress, getUserProgressInCoursesByUserId, updateProgress };