import jwt from "jsonwebtoken";
import Login from "../modal/login.js";
import { JWT_SECRET } from "../config/jwt.js";

export const requireAdmin = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(authorization.slice(7), JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }

  if (typeof decoded === "string" || !decoded.userId) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }

  const user = await Login.findById(decoded.userId);

  if (!user) {
    return res.status(401).json({ message: "Account not found" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
};
