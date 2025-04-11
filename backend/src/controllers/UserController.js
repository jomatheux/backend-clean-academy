import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/associations.js'
import 'dotenv/config';
// helpers
import getToken from '../helpers/get-token.js'
import createUserToken from '../helpers/create-user-token.js'
import userService from '../services/UserService.js';
import removeOldImage from '../helpers/removeOldImage.js';

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async register(req, res) {
        const { name, email, cpf, role, password, confirmpassword } = req.body;
        const image = `user/${req.file.filename}`;

        // validations
        if (!name) return res.status(422).json({ message: 'O nome é obrigatório!' });
        if (!email) return res.status(422).json({ message: 'O e-mail é obrigatório!' });
        if (!cpf) return res.status(422).json({ message: 'O cpf é obrigatório!' });
        if (!role) return res.status(422).json({ message: 'A permissão do usuário é obrigatória!' });
        if (!password) return res.status(422).json({ message: 'A senha é obrigatória!' });
        if (!confirmpassword) return res.status(422).json({ message: 'A confirmação de senha é obrigatória!' });
        if (password !== confirmpassword) {
            return res.status(422).json({ message: 'A senha e a confirmação precisam ser iguais!' });
        }

        // check if user exists
        const userExists = await User.findOne({ where: { email }, raw: true });
        if (userExists) return res.status(422).json({ message: 'Por favor, utilize outro email!' });

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        try {
            // create user
            const newUser = await this.userService.createUserWithCourses({
                name,
                email,
                cpf,
                password: passwordHash,
                role,
                image,
            });

            await createUserToken(newUser, req, res);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        if (!email) return res.status(422).json({ message: 'O e-mail é obrigatório!' });
        if (!password) return res.status(422).json({ message: 'A senha é obrigatória!' });

        // check if user exists
        const user = await User.findOne({ where: { email }, raw: true });
        if (!user) return res.status(422).json({ message: 'Credenciais inválidas' });

        // check if password match
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.status(422).json({ message: 'Credenciais inválidas' });

        await createUserToken(user, req, res);
    }

    async checkUser(req, res) {
        let currentUser;

        if (req.cookies.token) {
            const token = getToken(req);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            currentUser = await User.findOne({ where: { id: decoded.id }, raw: true });
            if (!currentUser) return res.status(404).json({ message: 'Usuário não encontrado!' });

            currentUser.password = undefined;
        } else {
            currentUser = null;
        }

        res.status(200).json({ user: currentUser });
    }

    async getUserById(req, res) {
        const { id } = req.params;

        const user = await User.findOne({ where: { id }, raw: true });
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' });

        user.password = undefined;
        res.status(200).json({ user });
    }

    async editUserById(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' });

        const { name, email, cpf, role, password, confirmpassword } = req.body;
        let oldImage = user.image;
        let image = oldImage;

        if (req.file) image = `user/${req.file.filename}`;

        // validations
        if (!name) return res.status(422).json({ message: 'O nome é obrigatório!' });
        if (!email) return res.status(422).json({ message: 'O e-mail é obrigatório!' });

        // check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (user.email !== email && userExists) {
            return res.status(422).json({ message: 'Por favor, utilize outro e-mail!' });
        }

        if (!role) return res.status(422).json({ message: 'O tipo de usuário é obrigatório!' });
        if (!cpf) return res.status(422).json({ message: 'O cpf é obrigatório!' });

        // check if password match
        if (password !== confirmpassword) {
            return res.status(422).json({ error: 'As senhas não conferem.' });
        } else if (password === confirmpassword && password != null) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            user.password = passwordHash;
        }

        try {
            if (image !== oldImage) removeOldImage(user);

            const updatedUser = await user.update({
                name,
                email,
                cpf,
                role,
                image,
                password: user.password,
            });

            updatedUser.password = undefined;
            res.json({ message: 'Usuário atualizado com sucesso!', updatedUser });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async deleteUserById(req, res) {
        const { id } = req.params;

        const user = await User.findOne({ where: { id }, raw: true });
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' });

        const deletedUser = await this.userService.deleteUserById(user.id);
        deletedUser.password = undefined;

        if (deletedUser) {
            res.status(200).json({ message: 'Usuário excluído com sucesso!', user: deletedUser });
        } else {
            res.status(500).json({ message: 'Falha ao excluir o usuário.' });
        }
    }

    async logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
        res.status(200).json({ message: 'Deslogado com sucesso!' });
    }
}

export default new UserController(userService);