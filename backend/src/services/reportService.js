import { Report, Test } from '../models/associations.js';

class ReportService {
    constructor(reportModel, testModel) {
        this.reportModel = reportModel;
        this.testModel = testModel;
    }

    async generateReport(userId, testId, receivedGrade) {
        try {
            const report = await this.reportModel.create({
                userId,
                testId,
                grade: receivedGrade,
            });

            console.log('Relatório gerado com sucesso:', report);
            return report;
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            throw error;
        }
    }

    async getReportOfUser(userId) {
        try {
            const reports = await this.reportModel.findAll({
                where: { userId },
                include: [
                    {
                        model: this.testModel,
                        as: 'tests',
                        attributes: ['id', 'minGrade', 'courseId'],
                    },
                ],
            });

            return reports;
        } catch (error) {
            console.error('Erro ao obter relatórios do usuário:', error);
            throw error;
        }
    }

    async registerAttempt(userId, testId, receivedGrade) {
        try {
            const lastAttempt = await this.reportModel.findOne({
                where: { userId, testId },
                order: [['attempt', 'DESC']],
            });

            const currentAttempt = lastAttempt ? lastAttempt.attempt + 1 : 1;

            const report = await this.reportModel.create({
                userId,
                testId,
                grade: receivedGrade,
                attempt: currentAttempt,
            });

            console.log(`Relatório da tentativa ${currentAttempt} gerado com sucesso:`, report);
            return report;
        } catch (error) {
            console.error('Erro ao registrar tentativa:', error);
            throw error;
        }
    }
}

export default new ReportService(Report, Test);