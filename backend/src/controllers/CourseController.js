import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import { sequelize, User, Course, UserCourse , Video} from '../models/associations.js'
import {addVideoToCourse, createCourseWithUsers, getCoursesWithProgressByUserId, getCourseWithVideos } from "../services/courseService.js"


const courseController = {
    // Criar um novo curso
    createCourse: async (req, res) => {
        try {
            const courseData = {
                title: req.body.title,
                description: req.body.description,
                duration: req.body.duration,
                isFinished: req.body.isFinished,
                image: req.body.image
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
        const course = await getCourseWithVideos(id)

        if (course.error) {
            return res.status(404).json(course)
        }

        res.status(200).json(course)
    },

    // Atualizar um curso
    updateCourseById: async (req, res) => {
        const { id } = req.params;
        const { title, description, duration, isFinished, image } = req.body;
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ error: 'Curso não encontrado!' });
        }
        await course.update({ title, description, duration, isFinished, image });
        res.status(200).json(course);
    },

    // Deletar um curso
    deleteCourseById: async (req, res) => {
        const { id } = req.params;
        const course = await Course.findByPk(id);
        const userCourse = await UserCourse.findAll({where: { courseId: id}});
        if (!course) {
            return res.status(404).json({ error: 'Curso não encontrado!' });
        }
        if (!userCourse) {
            return res.status(400).json({ error: 'Erro na deleção' });
        }
        await course.destroy();
        await userCourse.map(uc => uc.destroy());
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
        const videoData = req.body;
        try {
            const video = await addVideoToCourse(courseId, videoData);
            res.status(201).json({ message: 'Vídeo adicionado com sucesso!', video });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar vídeo', error });
        }
    },

    deleteVideoFromCourse: async (req, res) =>{
        const {id} = req.params
        const video = await Video.findByPk(id)
        if(!video){
            return res.status(404).json({error: 'Vídeo não encontrado!'})
        }
        await video.destroy()
        res.status(204).send()
    },

    updateVideoFromCourse: async (req, res) =>{
        const id = req.params.id
        const videoData = req.body
        const video = await Video.findByPk(id)
        if(!video){
            return res.status(404).json({error: 'Vídeo não encontrado!'})
        }
        await video.update(videoData)
        res.status(200).json(video)   
    },

    getVideo: async (req, res) =>{
        const {id} = req.params
        const video = await Video.findByPk(id)
        if(!video){
            return res.status(404).json({error: 'Vídeo não encontrado!'})
        }
        res.status(200).json(video)
    }
}

export default courseController;