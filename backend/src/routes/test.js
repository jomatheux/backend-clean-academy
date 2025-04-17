import express from "express"

const router = express.Router();

import TestController from "../controllers/TestController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";

router.post('/', authorizeAdmin, TestController.createTest.bind(TestController)); //admin
router.get('/', checkToken, TestController.getAllTests.bind(TestController));
router.get('/:id', checkToken, TestController.getAttemptsByTest.bind(TestController));
router.delete('/:id', authorizeAdmin, TestController.deleteTest.bind(TestController)); //admin
router.patch('/:id', authorizeAdmin, TestController.updateTest.bind(TestController)); //admin
router.post('/taketest/:id', checkToken, TestController.takeTest.bind(TestController));
router.post('/releasetest/:courseId', checkToken, TestController.releaseTest.bind(TestController));
router.get('/getByCourseId/:courseId', checkToken, TestController.getTestByCourseId.bind(TestController));
router.get('/getByUserToken', checkToken, TestController.getTestByUserToken.bind(TestController));

export default router;