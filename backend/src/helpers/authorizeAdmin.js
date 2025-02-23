import getUserByToken from "./get-user-by-token.js";
import getToken from "./get-token.js";

const authorizeAdmin = async (req, res, next) => {

  // Obtém o token do header da requisição
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado.' }); // Segurança extra
  }
  const user = await getUserByToken(token, req, res);

  if (!user) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado.' }); // Segurança extra
  }

  if (user.role !== "admin") {
    return res.status(403).json({ mensagem: 'Acesso negado. Você não tem permissão para acessar este recurso.' });
  }

  if (user.role === "admin") return next();

}

export default authorizeAdmin;