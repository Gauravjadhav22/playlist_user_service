import { Request } from 'express';
import jwt from "jsonwebtoken"
export const getUserIdFromHeaders = (req: Request): string | undefined => {
  // Assuming the JWT token is sent in the Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); 
   
    const decodedToken = jwt.decode(token);
    if (decodedToken && decodedToken.userId) {
      return decodedToken.userId;
    }
  }

  return undefined;
};
