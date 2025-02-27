import { generateReport, getReportOfUser, registerAttempt } from "../services/reportService.js"
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

const reportController = {
    generateReport: async (req, res) => {
        const token = getToken(req.headers.authorization);
        const user = await getUserByToken(token, req, res);
        const userId = user.id;
        const testId = req.params.id
        const receivedGrade = req.body.receivedGrade
        const report = await registerAttempt(userId, testId, receivedGrade);
        res.json(report);
    },

    getReportOfUser: async (req, res) => {
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        const userId = user.id;
        const report = await getReportOfUser(userId);
        res.json(report);
    },
}

export default reportController;