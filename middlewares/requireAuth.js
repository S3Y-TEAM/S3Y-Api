import { getUser } from "../controllers/SignIn.js";
import { isTokenValid } from "../utils/jwt.js";
import { roleSelection } from "../controllers/UserName.js";
import { responseBody } from "../utils/ResponseBody.js";

const requireAuth = async (req, res, next) => {
  let { role, authorization } = req.headers;
  if (!authorization || !role) {
    return res
      .status(400)
      .json(
        responseBody(
          "failed",
          "Authorization token and role required",
          400,
          null
        )
      );
  }

  const token = authorization.split(" ")[1];
  try {
    const decodedToken = isTokenValid(token);
    role = roleSelection(role);
    console.log(role, decodedToken, decodedToken.email);
    const u = await getUser(role, decodedToken.email);
    if (u) req.user = u;
    else throw new Error();

    next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json(responseBody("failed", "Request is not authorized", 401, null));
  }
};

export default requireAuth;
