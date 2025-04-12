import { UserCourse, Test, Report, Course } from '../models/associations.js';
import reportService  from './reportService.js';

class TestService {
    constructor(testModel, userCourseModel, reportModel, courseModel, reportService) {
        this.testModel = testModel;
        this.userCourseModel = userCourseModel;
        this.reportModel = reportModel;
        this.courseModel = courseModel;
        this.reportService = reportService;
    }

    async releaseTest(userId, courseId) {
        try {
            const userCourse = await this.userCourseModel.findOne({
                where: { userId, courseId },
            });

            if (!userCourse) {
                return { error: 'Usuário não está matriculado neste curso.' };
            }

            if (userCourse.progress < 100) {
                return { error: 'Test não liberada. O curso não foi concluído.' };
            }

            const test = await this.testModel.findOne({
                where: { courseId },
                attributes: ['id', 'questions', 'minGrade', 'qntQuestions'],
            });

            if (!test) {
                return { error: 'Test não encontrada para este curso.' };
            }

            return test;
        } catch (error) {
            console.error('Erro ao verificar liberação da Test:', error);
            throw error;
        }
    }

    async takeTest(testId, userId, answers) {
        try {
            const test = await this.testModel.findByPk(testId);

            if (!test) {
                return { error: 'Prova não encontrada.' };
            }

            const correctAnswers = test.questions.map((question) => question.correctAnswer);

            let receivedGrade = 0;
            for (let i = 0; i < test.qntQuestions; i++) {
                if (answers[i] === correctAnswers[i]) {
                    receivedGrade += 1;
                }
            }

            const report = await this.reportService.registerAttempt(userId, testId, receivedGrade);

            if (receivedGrade >= test.minGrade) {
                return { message: 'Prova concluída com sucesso!', report };
            } else {
                return { message: 'Nota insuficiente. Tente novamente.', report };
            }
        } catch (error) {
            console.error('Erro ao realizar a prova:', error);
            throw error;
        }
    }

    async getAttemptsByTest(userId, testId) {
        try {
            const reports = await this.reportModel.findAll({
                where: { userId, testId },
                order: [['attempt', 'ASC']],
            });

            return reports;
        } catch (error) {
            console.error('Erro ao obter tentativas:', error);
            throw error;
        }
    }

    async createTest(data) {
        try {
            const { courseId, questions, qntQuestions, minGrade } = data;

            const curso = await this.courseModel.findByPk(courseId);
            if (!curso) {
                return { error: 'Curso não encontrado.' };
            }

            if (questions.length !== qntQuestions) {
                return { error: 'A quantidade de questões não corresponde ao valor informado.' };
            }

            const test = await this.testModel.findOne({ where: { courseId } });
            if (test) {
                return;
            }

            const newTest = await this.testModel.create({
                courseId,
                questions,
                qntQuestions,
                minGrade,
            });

            return { message: 'Prova criada com sucesso!', newTest };
        } catch (error) {
            console.error('Erro ao criar a prova:', error);
            throw error;
        }
    }

    async getTestByCourseId(courseId) {
        try {
            const test = await this.testModel.findOne({
                where: { courseId },
                include: {
                    association: 'courses',
                    attributes: ['id', 'title', 'description'],
                },
            });

            if (!test) {
                return { message: 'Nenhuma prova encontrada para este curso.' };
            }

            return test;
        } catch (error) {
            console.error('Erro ao buscar a prova:', error);
            throw error;
        }
    }

    async getTestByUserId(userId) {
        try {
            const test = await this.testModel.findAll({
                where: { userId },
                include: {
                    association: 'users',
                    attributes: ['id', 'name'],
                },
            });
            if (!test) {
                return { message: 'Nenhuma prova encontrada para este usuário.' };
            }
            return test;
        } catch (error) {
            console.error('Erro ao buscar a prova:', error);
            throw error;
        }
    }
}

export default new TestService(Test, UserCourse, Report, Course, reportService);