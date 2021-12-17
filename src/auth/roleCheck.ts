import createHttpError from "http-errors";
import { RequestHandler } from "express"; // types for req, res, next

export const RoleCheckMiddleware: RequestHandler = (req, res, next) => {
  if (req.user.role === "Host") {
    next();
  } else {
    next(createHttpError(403, "Hosts only!"));
  }
};
