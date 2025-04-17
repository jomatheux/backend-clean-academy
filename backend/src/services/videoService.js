import removeOldImage from '../helpers/removeOldImage.js';
import removeOldUrl from '../helpers/removeOldUrl.js';
import { Course, UserCourse, Video } from '../models/associations.js';
import courseService from './courseService.js';

class VideoService {

    constructor( Video, Course, UserCourse, courseService ) {
        this.videoModel = Video;
        this.courseModel = Course;
        this.userCourseModel = UserCourse;
        this.courseService = courseService;
    }
    async addVideoToCourse(courseId, videoData, userId) {
        try {
            const newVideo = await this.videoModel.create({
                ...videoData,
                courseId,
            });

            const userCourses = await this.userCourseModel.findAll({ where: { courseId } });
            if (userCourses.length > 0) {
                const courseWithVideos = await this.courseService.getCourseWithVideosAndProducts(courseId, userId);
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
                const courseWithVideos = await this.courseService.getCourseWithVideosAndProducts(courseId, userId);
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
}

export default new VideoService(Video, Course, UserCourse, courseService);