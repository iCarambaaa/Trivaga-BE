import express, { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import UserModel from "../model/users";
import { tokenGenerator } from "../auth/authTools";
const bcrypt = require("bcrypt");


const verifyCredentials = async (email: string, plainPw: string) => {
        const user = await UserModel.findOne({ email });
    
        if (user) {
            const isMatch = await bcrypt.compare(plainPw, user.password);
            if (isMatch) {
                console.log("matched!!!!");
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

const usersRouter = express.Router();

usersRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = new UserModel(req.body);
        if (newUser) {
            const { _id } = await newUser.save();

            const { accessToken } = await tokenGenerator(newUser)
            res.status(201).send({ _id, accessToken });
        } else {
            next(createHttpError(401, "Credentials not ok!"));
        }
    } catch (error) {
        next(error);
    }
})

usersRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
    
        const user = await verifyCredentials(email, password);
    
        if (user) {
          const { accessToken } = await tokenGenerator(user);
          res.send({ accessToken });
        } else {
          next(createHttpError(401, "Credentials not ok!"));
        }
      } catch (error) {
        next(error);
      }
})

export default usersRouter