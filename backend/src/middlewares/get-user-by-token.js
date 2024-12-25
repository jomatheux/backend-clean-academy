import jwt from "jsonwebtoken";
import raw from "mysql2";

import User from "../models/User.js";
import 'dotenv/config';

// get user by jwt token
const getUserByToken = async (token) => {
  if (!token) return res.status(401).json({ error: "Acesso negado!" });

  // find user
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;

  const user = await User.findOne({where: {id: userId}, raw: true});

  return user;
};

export default getUserByToken;