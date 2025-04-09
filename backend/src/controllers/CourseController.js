import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import removeOldImage from '../helpers/removeOldImage.js';
import removeOldUrl from '../helpers/removeOldUrl.js';
import { sequelize, User, Course, UserCourse, Video } from '../models/associations.js'
import { addVideoToCourse, deleteVideo, createCourseWithUsers, getCoursesWithProgressByUserId, getCourseWithVideosAndProducts, updateProgress, getProgress, getUsersProgress, getUserProgressInCoursesByUserId } from "../services/courseService.js"


const courseController = {
    // Criar um novo curso
    createCourse: async (req, res) => {
        try {
            const courseData = {
                title: req.body.title,
                description: req.body.description,
                duration: req.body.duration,
                image: `course/${req.file.filename}`,
                level: req.body.level,
                instructor: req.body.instructor,
            };

            const newCourse = await createCourseWithUsers(courseData);

            res.status(201).json({ message: 'Curso criado com sucesso!', course: newCourse });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar curso', error });
        }
    },


    // Listar todos os cursos
    getAllCourses: async (req, res) => {
        const courses = await Course.findAll();
        res.json(courses);
    },

    // Buscar um curso pelo ID
    getCourseById: async (req, res) => {
        const { id } = req.params;
        const course = await getCourseWithVideosAndProducts(id)

        if (course.error) {
            return res.status(404).json(course)
        }

        res.status(200).json(course)
    },

    // Atualizar um curso
    updateCourseById: async (req, res) => {
        const { id } = req.params;
        const { title, description, duration, level, instructor } = req.body;
        const oldImage = await Course.findByPk(id).then(c => c.image);
        let image = oldImage;
        if (req.file) {
            image = `course/${req.file.filename}`;
        }
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ error: 'Curso não encontrado!' });
        }
        if (image !== oldImage) removeOldImage(course);
        await course.update({ title, description, duration, image, level, instructor });
        res.status(200).json(course);
    },

    // Deletar um curso
    deleteCourseById: async (req, res) => {
        const { id } = req.params;
        const course = await Course.findByPk(id);
        const userCourse = await UserCourse.findAll({ where: { courseId: id } });
        const video = await Video.findAll({ where: { courseId: id } });
        if (!course || !userCourse || !video) {
            return res.status(400).json({ error: 'Erro na deleção' });
        }
        if (course.image) removeOldImage(course);
        await course.destroy();
        await userCourse.map(uc => uc.destroy());
        await video.map(v => {
            if (v.image) removeOldImage(v);
            if (v.url) removeOldUrl(v);
            v.destroy();
        });
        res.status(204).send();
    },

    getCoursesWithProgress: async (req, res) => {
        const token = await getToken(req);
        if (!token) return res.status(404).json({ error: 'Acesso não autorizado!' });
        const user = await getUserByToken(token);
        if (!user.id) {
            return res.status(400).json({ error: 'Informe o ID do usuário!' });
        }
        const courses = await getCoursesWithProgressByUserId(user.id);
        res.json(courses);
    },

    addVideoToCourse: async (req, res) => {
        const courseId = req.params.id;
        const { title, duration, description } = req.body;
        let image = null;
        let url = null;
        if (req.files.video[0]) {
            image = `video/${req.files.image[0]}`;
        }
        if (req.files.url[0]) {
            url = `video/${req.files.url[0]}`;
        }
        
        try {
            const video = await addVideoToCourse(courseId, { title: title, url: url, description: description, duration: duration, image: image });
            res.status(201).json({ message: 'Vídeo adicionado com sucesso!', video });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar vídeo', error });
        }
    },

    deleteVideoFromCourse: async (req, res) => {
        const { id } = req.params;
        const video = await Video.findByPk(id);
        if (!video) {
            return res.status(404).json({ error: 'Vídeo não encontrado!' });
        }
        const deletedVideo = await deleteVideo(video.id);
        res.status(204).send(deletedVideo);
    },

    updateVideoFromCourse: async (req, res) => {
        const id = req.params.id;
        const video = await Video.findByPk(id);
        const { title, duration, description } = req.body;
        let oldImage = video.image;
        let oldUrl = video.url;
        let image = oldImage;
        let url = oldUrl;
        if (req.files.video[0]) {
            image = `video/${req.files.image[0]}`;
        }
        if (req.files.url[0]) {
            url = `video/${req.files.url[0]}`;
        }
        const videoData = { title: title, url: url, description: description, duration: duration, image: image };
        if (!video) {
            return res.status(404).json({ error: 'Vídeo não encontrado!' })
        }
        if (image !== oldImage) removeOldImage(video);
        if (url !== oldUrl) removeOldUrl(video);
        await video.update(videoData);
        res.status(200).json(video);
    },

    getVideo: async (req, res) => {
        const { id } = req.params
        const video = await Video.findByPk(id)
        if (!video) {
            return res.status(404).json({ error: 'Vídeo não encontrado!' })
        }
        res.status(200).json(video)
    },

    getProgressInCourse: async (req, res) => {
        // const userId = req.params.userId
        const courseId = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token, req, res)
        const userId = user.id

        if (!user || user.id != userId) {
            res.status(403).json({ message: 'Acesso não permitido!' })
            return
        }

        const progress = await getProgress(userId, courseId)

        if (!progress) {
            res.status(404).json({ message: 'Progresso não encontrado!' })
            return
        }

        res.status(200).json({ progress })
    },

    getUserProgressInAllCoursesByUserId: async (req, res) => {
        const userId = req.params.id
        const user = await User.findOne({ where: { id: userId }, raw: true })
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' })
        user.password = undefined
        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado.' })
            return
        }
        const progress = await getUserProgressInCoursesByUserId(userId);
        if (!progress) {
            res.status(404).json({ message: 'Progressos não encontrados!' });
            return;
        }
        res.status(200).json({ user, progress });
    },

    updateProgressInCourse: async (req, res) => {
        const courseId = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token, req, res)
        const userId = user.id
        const videoId = req.body.videoId

        if (!user || user.id != userId) {
            res.status(403).json({ message: 'Acesso não permitido!' })
            return
        }

        await updateProgress(userId, courseId, videoId);

        res.status(200).json({ message: 'Progresso atualizado com sucesso!' })
    },

    getUsersProgress: async (req, res) => {
        console.log('buscando usuários com seus progressos')
        const progress = await getUsersProgress();

        if (!progress) {
            res.status(404).json({ message: 'Progressos não encontrados!' });
            return;
        }

        res.status(200).json({ progress });
    },
}

export default courseController;