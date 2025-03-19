import express from "express"

const router = express.Router();

import TestController from "../controllers/TestController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";

router.post('/create', authorizeAdmin, TestController.createTest); //admin
router.get('/all', checkToken, TestController.getAllTests);
router.get('/:id', checkToken, TestController.getAttemptsByTest);
router.delete('/:id', authorizeAdmin, TestController.deleteTest); //admin
router.patch('/update/:id', authorizeAdmin, TestController.updateTest); //admin
router.post('/taketest/:id', checkToken, TestController.takeTest);
router.post('/releasetest/:id', checkToken, TestController.releaseTest);
router.get('/getByCourseId/:id', checkToken, TestController.getTestByCourseId);
router.get('/getByUserToken', checkToken, TestController.getTestByUserToken);

export default router;