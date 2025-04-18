import removeOldImage from '../helpers/removeOldImage.js';
import removeOldUrl from '../helpers/removeOldUrl.js';
import { Course, UserCourse, Video, Product, Test, Report } from '../models/associations.js';

class VideoService {

    constructor( Video, Course, UserCourse, Product, Test, Report) {
        this.videoModel = Video;
        this.courseModel = Course;
        this.userCourseModel = UserCourse;
        this.productModel = Product;
        this.testModel = Test;
        this.reportModel = Report;
    }
    async addVideoToCourse(courseId, videoData, userId) {
        try {
            const newVideo = await this.videoModel.create({
                ...videoData,
                courseId,
            });

            const userCourses = await this.userCourseModel.findAll({ where: { courseId } });
            if (userCourses.length > 0) {
                const courseWithVideos = await this.getCourseWithVideosAndProducts(courseId, userId);
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
    }

    async deleteVideo(videoId, userId) {
        try {
            const video = await this.videoModel.findByPk(videoId);
            if (!video) {
                console.log('Vídeo não encontrado.');
                return null;
            }
            const courseId = video.courseId;

            removeOldImage(video);
            removeOldUrl(video);
            await video.destroy();
            console.log('Vídeo deletado com sucesso!');

            const userCourses = await this.userCourseModel.findAll({ where: { courseId } });
            if (userCourses.length > 0) {
                const courseWithVideos = await this.getCourseWithVideosAndProducts(courseId, userId);
                const totalVideos = courseWithVideos.videos.length;

                await Promise.all(userCourses.map(async (uc) => {
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

            return video;
        } catch (error) {
            console.error('Erro ao deletar vídeo:', error);
            throw error;
        }
    }

    async getCourseWithVideosAndProducts(courseId, userId) {
        try {
            const course = await this.courseModel.findByPk(courseId, {
                include: [
                    {
                        model: this.videoModel,
                        as: 'videos',
                        attributes: ['id', 'title', 'url', 'duration', 'image', 'description'],
                    },
                    {
                        model: this.productModel,
                        as: 'products',
                        attributes: ['id', 'name', 'description', 'image'],
                    },
                    {
                        model: this.testModel,
                        as: 'tests',
                        attributes: ['id', 'questions', 'qntQuestions', 'minGrade'],
                        include: [
                            {
                                model: this.reportModel,
                                as: 'reports',
                                where: { userId },
                                required: false,
                                attributes: ['id', 'grade', 'createdAt'],
                            },
                        ],
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
}

export default new VideoService(Video, Course, UserCourse, Product, Test, Report);