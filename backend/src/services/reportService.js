import { Report } from '../models/associations.js';
import { Test } from '../models/associations.js';

async function generateReport(userId, testId, receivedGrade) {
    try {
        const report = await Report.create({
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

async function getReportOfUser(userId) {
    try {
        const reports = await Report.findAll({
            where: { userId },
            include: [
                {
                    model: Test,
                    as: 'test',
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

async function registerAttempt(userId, testId, receivedGrade) {
    try {
        // Obter a última tentativa registrada
        const lastAttempt = await Report.findOne({
            where: { userId, testId },
            order: [['attempt', 'DESC']], // Ordena pela tentativa mais recente
        });

        // Determinar o número da próxima tentativa
        const currentAttempt = lastAttempt ? lastAttempt.attempt + 1 : 1;

        // Criar o novo relatório
        const report = await Report.create({
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

export { generateReport, getReportOfUser, registerAttempt };