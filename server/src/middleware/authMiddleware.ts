// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "burek";

// Define a type for the user payload in the JWT
interface UserPayload {
  id: number;
  username: string;
}

// Extend the Express Request interface to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Optional user property
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (token == null) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden 1" });

    // Type the `user` parameter
    if (user && typeof user === "object") {
      req.user = user as UserPayload; // Attach user info to the request object
    } else {
      return res.status(403).json({ message: "Forbidden 2" });
    }

    next();
  });
};
