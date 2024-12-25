import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import raw from 'mysql2';

import User from '../models/User.js'
import 'dotenv/config';


// helpers
import getUserByToken from '../middlewares/get-user-by-token.js'
import getToken from '../middlewares/get-token.js'
import createUserToken from '../middlewares/create-user-token.js'

const userController = {
    register: async (req, res) => {
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const cpf = req.body.cpf
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
        const userExists = await User.findOne({where: {cpf: cpf}, raw: true})

        if (userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro cpf!' })
            return
        }

        // create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            cpf: cpf,
            password: passwordHash,
        })

        try {
            const newUser = await User.save(user)

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
        const user = await User.findOne({where: {email: email}, raw: true})

        if (!user) {
            return res
                .status(422)
                .json({ message: 'Não há usuário cadastrado com este e-mail!' })
        }

        // check if password match
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(422).json({ message: 'Senha inválida' })
        }

        await createUserToken(user, req, res)
    },

    checkUser: async (req, res) => {
        let currentUser

        console.log(req.headers.authorization)

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    },

    getUserById: async (req, res) => {
        const id = req.params.id

        const user = await User.findById(id)

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json({ user })
    },

    editUser: async (req, res) => {
        const token = getToken(req)

        //console.log(token);

        const user = await getUserByToken(token)

        // console.log(user);
        // console.log(req.body)
        // console.log(req.file.filename)

        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        let image = ''

        if (req.file) {
            image = req.file.filename
        }

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
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }

        user.email = email

        if (image) {
            const imageName = req.file.filename
            user.image = imageName
        }

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }

        user.phone = phone

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
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true },
            )
            res.json({
                message: 'Usuário atualizado com sucesso!',
                data: updatedUser,
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    },
}

export default userController;