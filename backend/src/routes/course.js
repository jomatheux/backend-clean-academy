import express from "express"

const router = express.Router();

import CourseController from "../controllers/CourseController.js";

router.post("/create", CourseController.createCourse); //admin

router.post("/addvideo/:id", CourseController.addVideoToCourse); //admin

router.delete("/deletevideo/:id", CourseController.deleteVideoFromCourse); //admin

router.patch("update/video/:id", CourseController.updateVideoFromCourse); //admin

router.get("/video/:id", CourseController.getVideo); //admin

router.get("/all", CourseController.getAllCourses);

router.get("/:id", CourseController.getCourseById);

router.get("/progress/incourse", CourseController.getCoursesWithProgress);

router.delete("/delete/:id", CourseController.deleteCourseById); //admin

router.patch("/update/:id", CourseController.updateCourseById); //admin

export default router;