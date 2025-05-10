import express from "express"

const router = express.Router();

import CourseController from "../controllers/CourseController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";
import uploadMinIO from "../helpers/uploadMinIO.js";

router.post("/", authorizeAdmin, uploadMinIO("image"), CourseController.createCourse.bind(CourseController)); //admin

router.get("/", checkToken, CourseController.getAllCourses.bind(CourseController));

router.get("/:id", checkToken, CourseController.getCourseById.bind(CourseController));

router.patch("/:id", authorizeAdmin, uploadMinIO("image"), CourseController.updateCourseById.bind(CourseController)); //admin

router.delete("/:id", authorizeAdmin, CourseController.deleteCourseById.bind(CourseController)); //admin

router.get("/progress/incourse", checkToken, CourseController.getCoursesWithProgress.bind(CourseController));

router.get("/progress/:id", checkToken, CourseController.getProgressInCourse.bind(CourseController));

router.get("/users/progress/:userId", authorizeAdmin, CourseController.getUserProgressInAllCoursesByUserId.bind(CourseController)); //admin

router.post("/progress/:id", checkToken, CourseController.updateProgressInCourse.bind(CourseController));

router.get("/users/progress", authorizeAdmin, CourseController.getUsersProgress.bind(CourseController)); //admin

export default router;