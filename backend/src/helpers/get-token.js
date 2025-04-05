// get token from headers
const getToken = (req) => {
  const token = req.cookies.token;

  if (!token) return;

  return token;
};

export default getToken;