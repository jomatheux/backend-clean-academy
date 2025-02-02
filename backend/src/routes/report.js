import express from "express"
const router = express.Router();
import ReportController from "../controllers/ReportController.js";

router.post('/generate/:id', ReportController.generateReport);
router.get('/get-report', ReportController.getReportOfUser);

export default router;