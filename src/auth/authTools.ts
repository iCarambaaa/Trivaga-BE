import { UsersDocument } from "../model/users";

const jwt = require("jsonwebtoken")


process.env.TS_NODE_DEV && require("dotenv").config();



const secret = process.env.JWT_SECRET!;

export const tokenGenerator = async (user: UsersDocument) => {
    const accessToken = await generateJWTToken({ _id: user._id });

    return { accessToken };
};

const generateJWTToken = (payload: string | {}) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "15m" }, (err: any, token: string) => {
            if (err) reject(err);
            else resolve(token);
        });
    });
};

export const verifyJWT = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err: any, decodedToken: string | any) => {
            if (err) reject(err);
            else resolve(decodedToken);
        });
    });
};