import { Op } from 'sequelize';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCourse from '../models/UserCourse.js';
import Video from '../models/Video.js';
import Product from '../models/Product.js';
import Test from '../models/Test.js';
import Report from '../models/Report.js';
import removeOldImage from '../helpers/removeOldImage.js';
import removeOldUrl from '../helpers/removeOldUrl.js';

class CourseService {
    constructor(courseModel, userModel, userCourseModel, videoModel, productModel, testModel, reportModel) {
        this.courseModel = courseModel;
        this.userModel = userModel;
        this.userCourseModel = userCourseModel;
        this.videoModel = videoModel;
        this.productModel = productModel;
        this.testModel = testModel;
        this.reportModel = reportModel;
    }

    async createCourseWithUsers(courseData) {
        try {
            const newCourse = await this.courseModel.create(courseData);
            const userIds = await this.userModel.findAll({ attributes: ['id'] }).then(users => users.map(user => user.id));
            const userCourseData = userIds.map(userId => ({
                userId,
                courseId: newCourse.id,
                progress: 0,
            }));
            await this.userCourseModel.bulkCreate(userCourseData);
            console.log('Curso criado e associado a todos os usuários com sucesso!');
            return newCourse;
        } catch (error) {
            console.error('Erro ao criar curso e associá-lo aos usuários:', error);
            throw error;
        }
    }

    async getCoursesWithProgressByUserId(userId) {
        console.log('Buscando cursos do usuário com ID:', userId);
        try {
            const userCourses = await this.userCourseModel.findAll({
                where: { userId },
                include: [
                    {
                        model: this.courseModel,
                        as: 'courses',
                        attributes: ['id', 'title', 'description', 'level', 'instructor'],
                    },
                ],
            });

            if (!userCourses.length) {
                return { error: 'Nenhum curso encontrado para este usuário.' };
            }

            return userCourses.map((userCourse) => ({
                courseId: userCourse.courses.id,
                title: userCourse.courses.title,
                description: userCourse.courses.description,
                progress: userCourse.progress,
                level: userCourse.courses.level,
                instructor: userCourse.courses.instructor,
                watchedVideos: userCourse.watchedVideos,
            }));
        } catch (error) {
            console.error('Erro ao buscar cursos do usuário:', error);
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

    async getProgress(userId, courseId) {
        try {
            const userCourse = await this.userCourseModel.findOne({ where: { userId, courseId } });
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
    }

    async getUsersProgress() {
        try {
            const usersProgress = await this.userModel.findAll({
                attributes: ['id', 'name'],
                include: [
                    {
                        model: this.userCourseModel,
                        as: 'userCourses',
                        attributes: ['progress'],
                        include: [
                            {
                                model: this.courseModel,
                                as: 'courses',
                                attributes: ['id', 'title', 'level', 'instructor'],
                            },
                        ],
                    },
                ],
            });

            const totalCoursesCount = await this.courseModel.count();

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
    }

    async getUserProgressInCoursesByUserId(userId) {
        console.log('Buscando cursos do usuário com ID:', userId);
        try {
            const userCourses = await this.userCourseModel.findAll({
                where: { userId },
                include: [
                    {
                        model: this.courseModel,
                        as: 'courses',
                        attributes: ['id', 'title', 'description', 'level', 'instructor'],
                    },
                ],
            });

            if (!userCourses.length) {
                return { error: 'Nenhum curso encontrado para este usuário.' };
            }

            return userCourses.map((userCourse) => ({
                courseId: userCourse.courses.id,
                title: userCourse.courses.title,
                description: userCourse.courses.description,
                progress: userCourse.progress,
                level: userCourse.courses.level,
                instructor: userCourse.courses.instructor,
                watchedVideos: userCourse.watchedVideos,
            }));
        } catch (error) {
            console.error('Erro ao buscar cursos do usuário:', error);
            throw error;
        }
    }

    async updateProgress(userId, courseId, videoId) {
        try {
            const userCourse = await this.userCourseModel.findOne({ where: { userId, courseId } });
            if (!userCourse) {
                console.log('Relacionamento usuário-curso não encontrado.');
                return null;
            }

            if (!userCourse.watchedVideos.includes(videoId)) {
                userCourse.watchedVideos.push(videoId);
                userCourse.changed('watchedVideos', true);
            }

            const courseWithVideos = await this.getCourseWithVideosAndProducts(courseId, userId);
            const totalVideos = courseWithVideos.videos.length;
            const completedVideos = userCourse.watchedVideos.length;
            const newProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

            userCourse.progress = newProgress;
            await userCourse.save();
            console.log(`Progresso do usuário ${userId} atualizado para: ${newProgress}%`);

            return userCourse;
        } catch (error) {
            console.error('Erro ao atualizar progresso:', error);
            throw error;
        }
    }
}

export default new CourseService(Course, User, UserCourse, Video, Product, Test, Report);