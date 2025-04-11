import express from "express"

const router = express.Router();

import CourseController from "../controllers/CourseController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";
import upload from "../helpers/upload.js";

router.post("/create", authorizeAdmin, upload.single("image"), CourseController.createCourse.bind(CourseController)); //admin

router.post("/addvideo/:id", authorizeAdmin, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "url", maxCount: 1 }]),
    CourseController.addVideoToCourse.bind(CourseController)); //admin

router.delete("/deletevideo/:id", authorizeAdmin, CourseController.deleteVideoFromCourse.bind(CourseController)); //admin

router.patch("/update/video/:id", authorizeAdmin, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "url", maxCount: 1 }]),
    CourseController.updateVideoFromCourse.bind(CourseController)); //admin

router.get("/video/:id", checkToken, CourseController.getVideo.bind(CourseController));

router.get("/all", checkToken, CourseController.getAllCourses.bind(CourseController));

router.get("/:id", checkToken, CourseController.getCourseById.bind(CourseController));

router.patch("/update/:id", authorizeAdmin, upload.single("image"), CourseController.updateCourseById).bind(CourseController); //admin

router.delete("/delete/:id", authorizeAdmin, CourseController.deleteCourseById.bind(CourseController)); //admin

router.get("/progress/incourse", checkToken, CourseController.getCoursesWithProgress.bind(CourseController));

router.get("/progress/:id", checkToken, CourseController.getProgressInCourse.bind(CourseController));

router.get("/users/progress/:id", authorizeAdmin, CourseController.getUserProgressInAllCoursesByUserId.bind(CourseController)); //admin

router.post("/progress/:id", checkToken, CourseController.updateProgressInCourse.bind(CourseController));

router.get("/users/progress", authorizeAdmin, CourseController.getUsersProgress.bind(CourseController)); //admin

export default router;