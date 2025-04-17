import express from "express"
const router = express.Router();
import ReportController from "../controllers/ReportController.js";

import checkToken from "../helpers/check-token.js";

router.post('/:testId', checkToken, ReportController.generateReport.bind(ReportController));
router.get('/', checkToken, ReportController.getReportOfUser.bind(ReportController));

export default router;