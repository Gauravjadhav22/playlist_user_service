import jwt from "jsonwebtoken";
import { InvalidTokenError } from "./ErrorHandler";

const secrete = process.env.JWT_SECRET

const Authenticator = (req, res, err, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    throw new InvalidTokenError();
  }

  try {

    const decodedToken = jwt.verify(token,secrete)
    req.userId = decodedToken.userId; 
    next();


  } catch (error) {
    throw new InvalidTokenError();
  }
};
