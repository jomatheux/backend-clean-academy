import jwt from "jsonwebtoken";
import 'dotenv/config';

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    // payload data
    {
      name: user.name,
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  // set token in cookie
  res.cookie('token', token, {
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // Use true em produção
    // sameSite: 'strict', // Proteção contra CSRF
    // maxAge: 3600000, // 1 hora
    httpOnly: true,
    secure: false, // só em dev!
    sameSite: 'none', // ou 'none' se quiser testar cross-origin com cookies
    path: '/',
    maxAge: 3600 * 1000, 
    origin: 'http://localhost:3000', // Permitir cookies apenas de localhost 
  });

  // return token
  res.status(200).json({
    message: "Você está autenticado!",
    userId: user.id,
    role: user.role,
  });
};

export default createUserToken;