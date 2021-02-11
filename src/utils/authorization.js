// for express
import jwt from "jsonwebtoken";

const authorization = async (req, res, next) => {
    try {
      const jwToken = req.cookies.token
      const payload = jwt.verify(jwToken, process.env.SECRET_KEY);
      req.user = payload.user;
  
      next();
    } catch (err) {
      res.redirect("/admin")
    }
  };
  
  export default authorization