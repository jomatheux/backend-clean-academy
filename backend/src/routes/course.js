import express from "express"

const router = express.Router();

import CourseController from "../controllers/CourseController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";
import upload from "../helpers/upload.js";

router.post("/create", authorizeAdmin, upload.single("image"), CourseController.createCourse); //admin

router.post("/addvideo/:id", authorizeAdmin, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "url", maxCount: 1 }]),
    CourseController.addVideoToCourse); //admin

router.delete("/deletevideo/:id", authorizeAdmin, CourseController.deleteVideoFromCourse); //admin

router.patch("/update/video/:id", authorizeAdmin, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "url", maxCount: 1 }]),
    CourseController.updateVideoFromCourse); //admin

router.get("/video/:id", checkToken, CourseController.getVideo);

router.get("/all", checkToken, CourseController.getAllCourses);

router.get("/:id", checkToken, CourseController.getCourseById);

router.patch("/update/:id", authorizeAdmin, upload.single("image"), CourseController.updateCourseById); //admin

router.delete("/delete/:id", authorizeAdmin, CourseController.deleteCourseById); //admin

router.get("/progress/incourse", checkToken, CourseController.getCoursesWithProgress);

router.get("/progress/:id", checkToken, CourseController.getProgressInCourse);

router.get("/users/progress/:id", authorizeAdmin, CourseController.getUserProgressInAllCoursesByUserId); //admin

router.post("/progress/:id", checkToken, CourseController.updateProgressInCourse);

router.get("/users/progress", authorizeAdmin, CourseController.getUsersProgress); //admin

export default router;