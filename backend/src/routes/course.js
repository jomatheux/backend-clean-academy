import express from "express"

const router = express.Router();

import CourseController from "../controllers/CourseController.js";

router.post("/create", CourseController.createCourse);

router.post("/addvideo/:id", CourseController.addVideoToCourse);

router.delete("/deletevideo/:id", CourseController.deleteVideoFromCourse);

router.get("/all", CourseController.getAllCourses);

router.get("/:id", CourseController.getCourseById);

router.get("/progress/incourse", CourseController.getCoursesWithProgress);

router.delete("/delete/:id", CourseController.deleteCourseById);

router.patch("/update/:id", CourseController.updateCourseById);

export default router;