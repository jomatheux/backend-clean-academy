import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/associations.js'
import 'dotenv/config';
// helpers
import getUserByToken from '../helpers/get-user-by-token.js'
import getToken from '../helpers/get-token.js'
import createUserToken from '../helpers/create-user-token.js'
import { createUserWithCourses, deleteUserById } from '../services/userService.js';


const userController = {
    register: async (req, res) => {
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const cpf = req.body.cpf
        const role = req.body.role
        const image = req.body.image
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword


        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }

        if (!cpf) {
            res.status(422).json({ message: 'O cpf é obrigatório!' })
            return
        }

        if (!role) {
            res.status(422).json({ message: 'A permissão do usuário é obrigatória!' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
            return
        }

        if (password != confirmpassword) {
            res
                .status(422)
                .json({ message: 'A senha e a confirmação precisam ser iguais!' })
            return
        }

        // check if user exists
        const userExists = await User.findOne({ where: { email: email }, raw: true })

        if (userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro email!' })
            return
        }

        // create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        try {
            // create user
            const newUser = await createUserWithCourses({
                name: name,
                email: email,
                phone: phone,
                cpf: cpf,
                password: passwordHash,
                role: role,
                image: image,
            });

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    },

    login: async (req, res) => {
        const email = req.body.email
        const password = req.body.password

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }

        // check if user exists
        const user = await User.findOne({ where: { email: email }, raw: true })

        if (!user) {
            return res
                .status(422)
                .json({ message: 'Credenciais inválidas' })
        }

        // check if password match
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(422).json({ message: 'Credenciais inválidas' })
        }

        await createUserToken(user, req, res)
    },

    checkUser: async (req, res) => {
        let currentUser

        console.log(req.headers.authorization)

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            currentUser = await User.findOne({ where: { id: decoded.id }, raw: true })

            if (!currentUser) {
                res.status(404).json({ message: 'Usuário não encontrado!' });
                return;
            }

            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).json({ user: currentUser })
    },

    getUserById: async (req, res) => {
        const id = req.params.id

        const user = await User.findOne({ where: { id: id }, raw: true })

        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        user.password = undefined

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json({ user })
    },

    editUserById: async (req, res) => {

        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        // console.log(user);
        // console.log(req.body)
        // console.log(req.file.filename)

        const name = req.body.name
        const email = req.body.email
        const cpf = req.body.cpf
        const role = req.body.role
        const image = req.body.image
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        // console.log(req.body)

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        user.name = name

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }

        // check if user exists
        const userExists = await User.findOne({ where: { email: email } })

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }

        user.email = email

        if (image) {
            const imageName = req.body.image
            user.image = imageName
        }

        if (!role) {
            res.status(422).json({ message: 'O tipo de usuário é obrigatório!' })
            return
        }

        user.role = role

        if (!cpf) {
            res.status(422).json({ message: 'O cpf é obrigatório!' })
            return
        }

        user.cpf = cpf

        // check if password match
        if (password != confirmpassword) {
            res.status(422).json({ error: 'As senhas não conferem.' })

            // change password
        } else if (password == confirmpassword && password != null) {
            // creating password
            const salt = await bcrypt.genSalt(12)
            const reqPassword = req.body.password

            const passwordHash = await bcrypt.hash(reqPassword, salt)

            user.password = passwordHash
        }

        try {
            // returns updated data
            const updatedUser = await user.update({
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                role: user.role,
                image: user.image,
                password: user.password
            })
            updatedUser.password = undefined
            res.json({
                message: 'Usuário atualizado com sucesso!',
                updatedUser: updatedUser,
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    },

    deleteUserById: async (req, res) => {
        const id = req.params.id;

        const user = await User.findOne({ where: { id: id }, raw: true })
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }
        const deletedUser = await deleteUserById(user.id);
        deletedUser.password = undefined
        if (deletedUser) {
            res.status(200).json({ message: 'Usuário excluído com sucesso!', user: deletedUser });
        } else {
            res.status(500).json({ message: 'Falha ao excluir o usuário.' })
        }
    },
}

export default userController;