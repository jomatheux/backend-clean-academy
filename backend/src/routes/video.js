import express from "express"

const router = express.Router();

import VideoController from "../controllers/VideoController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";
import upload from "../helpers/upload.js";

router.post("/:id", authorizeAdmin, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "url", maxCount: 1 }]),
    VideoController.addVideoToCourse.bind(VideoController)); //admin

router.delete("/:id", authorizeAdmin, VideoController.deleteVideoFromCourse.bind(VideoController)); //admin

router.patch("/:id", authorizeAdmin, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "url", maxCount: 1 }]),
    VideoController.updateVideoFromCourse.bind(VideoController)); //admin

router.get("/:id", checkToken, VideoController.getVideo.bind(VideoController));

export default router;