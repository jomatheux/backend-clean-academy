import express from "express"

const router = express.Router();

import VideoController from "../controllers/VideoController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";
import upload from "../helpers/upload.js";
import uploadMinIO from "../helpers/uploadMinIO.js";

router.post("/:courseId", authorizeAdmin, uploadMinIO("url"), (req, res, next) => {
    const url = req.file;
    if (!url) {
        return res.status(400).json({ message: "Por favor, envie um arquivo." });
    }
    next();
},VideoController.addVideoToCourse.bind(VideoController)); //admin

router.delete("/:id", authorizeAdmin, VideoController.deleteVideoFromCourse.bind(VideoController)); //admin

router.patch("/:id", authorizeAdmin, uploadMinIO("url"), (req, res, next) => {
    const url = req.file;
    if (!url) {
        return res.status(400).json({ message: "Por favor, envie um arquivo." });
    }
    next();
}, VideoController.updateVideoFromCourse.bind(VideoController)); //admin

router.get("/:id", checkToken, VideoController.getVideo.bind(VideoController));

export default router;