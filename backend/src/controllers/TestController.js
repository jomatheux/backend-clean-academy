import testService from "../services/testService.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";
import Test from "../models/Test.js";

class TestController {
    constructor(testService) {
        this.testService = testService;
    }

    async createTest(req, res) {
        const data = await req.body;
        const test = await this.testService.createTest(data);
        if (!test) return res.status(404).json({ error: "Erro ao criar teste" });
        res.status(201).json(test);
    }

    async getAllTests(req, res) {
        const tests = await Test.findAll();
        if (!tests) return res.status(404).json("Nenhum curso encontrado.");
        res.status(200).json(tests);
    }

    async getAttemptsByTest(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        const testId = req.params.id;
        const attempts = await this.testService.getAttemptsByTest(testId, user.id);
        if (!attempts) return res.status(404).json("Tentativas não encontradas");
        res.json(attempts);
    }

    async deleteTest(req, res) {
        const testId = req.params.id;
        const test = await Test.findByPk(testId);
        if (!test) return res.status(404).json("Teste não encontrado");
        await test.destroy();
        res.json("Teste deletado com sucesso");
    }

    async updateTest(req, res) {
        const testId = req.params.id;
        const test = await Test.findByPk(testId);
        if (!test) return res.status(404).json("Teste não encontrado");
        const updatedTest = await test.update(req.body);
        if (!updatedTest) return res.status(404).json("Erro ao atualizar teste");
        res.json(updatedTest);
    }

    async takeTest(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        const testId = req.params.id;
        const answers = req.body.answers;

        if (!user) return res.status(404).json("Usuário não encontrado");
        const test = await this.testService.takeTest(testId, user.id, answers);
        if (!test) return res.status(404).json("Teste não encontrado");
        res.json(test);
    }

    async releaseTest(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token, req, res);
        const courseId = req.params.id;

        const test = await this.testService.releaseTest(user.id, courseId);
        if (!test) return res.status(404).json("Teste não encontrado");
        res.json(test);
    }

    async getTestByCourseId(req, res) {
        const courseId = req.params.id;
        const test = await Test.findAll({ where: { courseId } });
        if (!test) return res.status(404).json("Teste não encontrado");
        res.status(200).json(test);
    }

    async getTestByUserToken(req, res) {
        const token = getToken(req);
        if (!token) return res.status(404).json({ error: "Acesso não autorizado!" });
        const user = await getUserByToken(req, res, token);
        const test = await this.testService.getTestByUserId(user.id);
        if (!test) return res.status(404).json("Teste não encontrado");
        res.status(200).json(test);
    }
}

export default new TestController(testService);