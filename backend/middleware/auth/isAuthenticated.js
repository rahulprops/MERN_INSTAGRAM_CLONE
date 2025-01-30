import jwt from "jsonwebtoken";
import errorHandler from "../error_logs/errorHandler.js";
const isAuthenticated = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  try {
    // console.log(refreshToken)
    if (!refreshToken) {
      return errorHandler(res, 400, "user not authenticated");
    }

    const decode = jwt.verify(refreshToken, process.env.JWT);
    if (!decode) {
      return errorHandler(res, 401, "invlaid");
    }
    req.id = decode.userId;
    next();
  } catch (err) {
    return errorHandler(res, 500, `server error ${err.message}`);
  }
};
export default isAuthenticated;
