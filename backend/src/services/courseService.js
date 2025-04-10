import { Op } from 'sequelize';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCourse from '../models/UserCourse.js';
import Video from '../models/Video.js';
import Product from '../models/Product.js';
import removeOldImage from '../helpers/removeOldImage.js';
import removeOldUrl from '../helpers/removeOldUrl.js';


const createCourseWithUsers = async (courseData) => {
  try {
    // Cria o curso
    const newCourse = await Course.create(courseData);

    // Busca todos os IDs dos usuários de forma mais eficiente
    const userIds = await User.findAll({ attributes: ['id'] }).then(users => users.map(user => user.id));

    // Cria o relacionamento entre o curso e os usuários
    const userCourseData = userIds.map(userId => ({
      userId,
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
          attributes: ['id', 'title', 'description', 'level', 'instructor'], // Campos que queremos do modelo Course
        },
      ],
    });

    if (!userCourses.length) {
      return { error: 'Nenhum curso encontrado para este usuário.' };
    }

    // Retorna os cursos com o progresso
    return userCourses.map((userCourse) => ({
      courseId: userCourse.course.id,
      title: userCourse.course.title,
      description: userCourse.course.description,
      progress: userCourse.progress,
      level: userCourse.course.level,
      instructor: userCourse.course.instructor,
      watchedVideos: userCourse.watchedVideos,
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    throw error;
  }
};

const getCourseWithVideosAndProducts = async (courseId) => {
  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Video,
          as: 'videos',
          attributes: ['id', 'title', 'url', 'duration', 'image', 'description'], // Campos que deseja retornar
        },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'description', 'image'],
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

    // Atualiza o progresso do curso de forma mais eficiente
    const userCourses = await UserCourse.findAll({ where: { courseId } });
    if (userCourses.length > 0) {
      const courseWithVideos = await getCourseWithVideosAndProducts(courseId);
      const totalVideos = courseWithVideos.videos.length;

      await Promise.all(userCourses.map(async (uc) => {
        const completedVideos = uc.watchedVideos.length;
        const newProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        uc.progress = newProgress;
        await uc.save();
        console.log(`Progresso do usuário ${uc.userId} atualizado para: ${newProgress}%`);
      }));
      console.log('Progresso de todos os usuários no curso atualizado com sucesso!');
    } else {
      console.log('Nenhum usuário associado a este curso.');
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
      return null; // Retornar null para indicar que nada foi deletado
    }
    const courseId = video.courseId;

    // Deleta o vídeo e espera a conclusão
    removeOldImage(video);
    removeOldUrl(video);
    await video.destroy();
    console.log('Vídeo deletado com sucesso!');

    // Atualiza o progresso do curso de forma mais eficiente
    const userCourses = await UserCourse.findAll({ where: { courseId } });
    if (userCourses.length > 0) {
      const courseWithVideos = await getCourseWithVideosAndProducts(courseId);
      const totalVideos = courseWithVideos.videos.length;

      await Promise.all(userCourses.map(async (uc) => {
        // Remove o video deletado da lista de videos assistidos
        uc.watchedVideos = uc.watchedVideos.filter(v => v !== videoId);
        uc.changed('watchedVideos', true);

        const completedVideos = uc.watchedVideos.length;
        const newProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        uc.progress = newProgress;
        await uc.save();
        console.log(`Progresso do usuário ${uc.userId} atualizado para: ${newProgress}%`);
      }));
      console.log('Progresso de todos os usuários no curso atualizado com sucesso!');
    } else {
      console.log('Nenhum usuário associado a este curso.');
    }

    return video; // Retorna o vídeo deletado
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    throw error;
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
      attributes: ['id', 'name'],
      include: [
        {
          model: UserCourse,
          as: 'userCourses',
          attributes: ['progress'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'level', 'instructor'],
            },
          ],
        },
      ],
    });

    const totalCoursesCount = await Course.count();

    const formattedProgress = usersProgress.map(user => {
      const completedCourses = user.userCourses.filter(uc => uc.progress === 100).length;

      return {
        id: user.id,
        name: user.name,
        progress: `${completedCourses}/${totalCoursesCount}`,
      };
    });

    return formattedProgress;
  } catch (error) {
    console.error('Erro ao recuperar o progresso dos usuários:', error);
    throw error;
  }
};  

const getUserProgressInCoursesByUserId = async (userId) => {
  console.log('Buscando cursos do usuário com ID:', userId);
  try {
    const userCourses = await UserCourse.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'level', 'instructor'],
        },
      ],
    });

    if (!userCourses.length) {
      return { error: 'Nenhum curso encontrado para este usuário.' };
    }

    return userCourses.map((userCourse) => ({
      courseId: userCourse.course.id,
      title: userCourse.course.title,
      description: userCourse.course.description,
      progress: userCourse.progress,
      whatchedVideos: userCourse.watchedVideos, // Corrigir typo
      level: userCourse.course.level,
      instructor: userCourse.course.instructor,
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    throw error;
  };
};

const updateProgress = async (userId, courseId, videoId) => {
  try {
    const userCourse = await UserCourse.findOne({ where: { userId, courseId } });
    if (!userCourse) {
      console.log('Relacionamento usuário-curso não encontrado.');
      return;
    }

    const video = await Video.findByPk(videoId);
    if (!video) {
      console.log('Vídeo não encontrado.');
      return;
    }

    const watchedVideos = userCourse.watchedVideos;
    if (!watchedVideos.includes(videoId)) {
      watchedVideos.push(videoId);
      userCourse.watchedVideos = watchedVideos;
      userCourse.changed('watchedVideos', true);
      await userCourse.save();
    }

    const courseWithVideos = await getCourseWithVideosAndProducts(courseId);
    const totalVideos = courseWithVideos.videos.length;
    const completedVideos = userCourse.watchedVideos.length;
    const newProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    userCourse.progress = newProgress;
    await userCourse.save();
    console.log(`Progresso do usuário ${userId} no curso ${courseId} atualizado para: ${newProgress}%`);

  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
  }
};

export { createCourseWithUsers, getCoursesWithProgressByUserId, getCourseWithVideosAndProducts, addVideoToCourse, deleteVideo, getProgress, getUsersProgress, getUserProgressInCoursesByUserId, updateProgress };