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

  // return token
  res.status(200).json({
    message: "Você está autenticado!",
    token: token,
    userId: user.id,
    role: user.role,
  });
};

export default createUserToken;