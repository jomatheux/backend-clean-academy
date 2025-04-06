import jwt from "jsonwebtoken";
import 'dotenv/config';
import getToken from "./get-token.js";

// middleware to validate token
const checkToken = (req, res, next) => {
  // Get token
  const token = getToken(req);

  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

export default checkToken;