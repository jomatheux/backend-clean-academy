import express from "express"

const router = express.Router();

import CourseController from "../controllers/CourseController.js";

router.post("/create", CourseController.createCourse); //admin

router.post("/addvideo/:id", CourseController.addVideoToCourse); //admin

router.delete("/deletevideo/:id", CourseController.deleteVideoFromCourse); //admin

router.patch("/update/video/:id", CourseController.updateVideoFromCourse); //admin

router.get("/video/:id", CourseController.getVideo);

router.get("/all", CourseController.getAllCourses);

router.get("/:id", CourseController.getCourseById);

router.patch("/update/:id", CourseController.updateCourseById); //admin

router.delete("/delete/:id", CourseController.deleteCourseById); //admin

router.get("/progress/incourse", CourseController.getCoursesWithProgress);

router.get("/progress/:id", CourseController.getProgressInCourse);

router.get("/users/progress/:id", CourseController.getUserProgressInAllCoursesByUserId); //admin

router.post("/progress/:id", CourseController.updateProgressInCourse);

router.get("/users/progress", CourseController.getUsersProgress); //admin

export default router;