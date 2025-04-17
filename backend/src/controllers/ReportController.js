import reportService from "../services/reportService.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }

    async generateReport(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        const userId = user.id;
        const testId = req.params.testId;
        const receivedGrade = req.body.receivedGrade;
        const report = await this.reportService.registerAttempt(userId, testId, receivedGrade);
        res.json(report);
    }

    async getReportOfUser(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        const userId = user.id;
        const report = await this.reportService.getReportOfUser(userId);
        res.json(report);
    }
}

export default new ReportController(reportService);