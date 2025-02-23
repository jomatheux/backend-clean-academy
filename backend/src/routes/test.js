import express from "express"

const router = express.Router();

import TestController from "../controllers/TestController.js";

router.post('/create', TestController.createTest); //admin
router.get('/all', TestController.getAllTests);
router.get('/:id', TestController.getAttemptsByTest);
router.delete('/:id', TestController.deleteTest); //admin
router.patch('/update/:id', TestController.updateTest); //admin
router.post('/taketest', TestController.takeTest);
router.post('/releasetest/:id', TestController.releaseTest);
router.get('/getByCourseId/:id', TestController.getTestByCourseId);
router.get('/getByUserToken', TestController.getTestByUserToken);

export default router;