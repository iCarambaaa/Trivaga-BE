import createHttpError from "http-errors"
import { Request, Response, NextFunction } from "express"
import { UsersDocument } from "../model/users"


declare global {
  namespace Express {
      interface Request {
          user?: UsersDocument;
      }
  }
}

export const adminOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req?.user?.role === "Host") {
    next()
  } else {
    next(createHttpError(403, "Admins only!"))
  }
}