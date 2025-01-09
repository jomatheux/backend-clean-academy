import { releaseTest, takeTest, getAttemptsByTest, createTest, getTestByUserId} from "../services/testService.js"
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";
import Test from "../models/Test.js";

const testController = {
    // Criar um novo teste
    createTest: async (req, res) => {
        const data = await req.body;
        const test = await createTest(data);
        res.status(201).json(test)
    },

    // Retornar todos os testes
    getAllTests: async (req, res) => {
        const tests = await Test.findAll();
        if(!tests) return res.status(404).json("Nenhum curso encontrado.");
        res.status(200).json(tests)
    },

    getAttemptsByTest: async (req, res) => {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const testId = req.params.id;
        const attempts = await getAttemptsByTest(testId, user.id);
        if(!attempts) return res.status(404).json("Tentativas não encontradas")
        res.json(attempts)
    },

    takeTest: async (req, res) => {
        const token = getToken(token);
        const user = await getUserByToken(token);
        const testId = req.params.id;
        const receivedGrade = req.body.receivedGrade

        if(!user) return res.status(404).json("Usuário não encontrado");
        const test = await takeTest(testId, user.id, receivedGrade);
        if(!test) return res.status(404).json("Teste não encontrado");
        res.json(test)
    },

    releaseTest: async (req, res) => {
        const token = getToken(token);
        const user = await getUserByToken(token);
        const testId = req.params.id;

        const test = releaseTest(user.id, testId);
        if(!test) return res.status(404).json("Teste não encontrado")
        res.json(test)
    },

    getTestByCourseId: async (req, res) => {
        const courseId = req.params.id;
        const test = await Test.findAll({ where: { courseId } });
        if(!test) return res.status(404).json("Teste não encontrado");
        res.status(200).json(test)
    },

    getTestByUserToken: async (req, res) => {
        const token = getToken(req);
        if(!token) return res.status(404).json({ error: "Acesso não autorizado!" });
        const user = await getUserByToken(token);
        const test = await getTestByUserId(user.id);
        if(!test) return res.status(404).json("Teste não encontrado");
        res.status(200).json(test)
    }
 
}

export default testController;