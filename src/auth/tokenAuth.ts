import createHttpError from "http-errors"
import UserModel from "../model/users"
import { verifyJWT } from "./authTools.js"
import { Request, Response, NextFunction } from "express"
import { UsersDocument } from "../model/users.js"

declare global {
    namespace Express {
        interface Request {
            user?: UsersDocument;
        }
    }
}

export const tokenAuth = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        next(createHttpError(404, "Please provide token in Authorization header!"))
    } else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")

            const decodedToken: UsersDocument | any = await verifyJWT(token)

            const user = await UserModel.findById(decodedToken._id)
            if(user) {
                req.user = user
                next()
            } else {
                next(createHttpError(404, "User not found"))
            }
        } catch (error) {
            next(createHttpError(401, "Token not valid!"))
        }
    }
}