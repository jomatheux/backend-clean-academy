// get token from headers
const getToken = (req) => {
  // Example: Get token from cookies
  const token = req.cookies.token;
// ================================================================
  // Example: Get token from query params
  // Get token from headers
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];

  if (!token) return;

  return token;
};

export default getToken;