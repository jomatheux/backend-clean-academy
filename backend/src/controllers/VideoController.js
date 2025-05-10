import videoService from "../services/videoService.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";
import Video from "../models/Video.js";
import removeOldUrl from "../helpers/removeOldUrl.js";
import deleteObjectMinioByUrl from "../helpers/deleteObjectS3ByUrlV3MinIO.js";

class VideoController {

    constructor(videoService, videoModel) {
        this.videoModel = videoModel;
        this.videoService = videoService;
    }

    async addVideoToCourse(req, res) {
        const courseId = req.params.courseId;
        const { title, duration, description } = req.body;
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        let url = null;
        if (req.file) {
            url = `${process.env.MINIO_BUCKET_URL}/video/${req.file.filename}`;
        }

        try {
            const video = await this.videoService.addVideoToCourse(courseId, { title, url, description, duration }, user.id);
            res.status(201).json({ message: 'Vídeo adicionado com sucesso!', video });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar vídeo', error });
        }
    }

    async deleteVideoFromCourse(req, res) {
        const { id } = req.params;
        const video = await this.videoModel.findByPk(id);
        if (!video) {
            return res.status(404).json({ error: 'Vídeo não encontrado!' });
        }
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        const deletedVideo = await this.videoService.deleteVideo(video.id, user.id);
        res.status(204).send(deletedVideo);
    }

    async updateVideoFromCourse(req, res) {
        const id = req.params.id;
        const video = await this.videoModel.findByPk(id);
        const { title, duration, description } = req.body;
        let oldUrl = video.url;
        let url = oldUrl;
        if (req.file) {
            url = `${process.env.MINIO_BUCKET_URL}/video/${req.file.filename}`;
        }
        const videoData = { title, url, description, duration };
        if (!video) {
            return res.status(404).json({ error: 'Vídeo não encontrado!' });
        }
        if (url !== oldUrl) deleteObjectMinioByUrl(oldUrl);
        await video.update(videoData);
        res.status(200).json(video);
    }

    async getVideo(req, res) {
        const { id } = req.params;
        const video = await this.videoModel.findByPk(id);
        if (!video) {
            return res.status(404).json({ error: 'Vídeo não encontrado!' });
        }
        res.status(200).json(video);
    }
}

export default new VideoController(videoService, Video);