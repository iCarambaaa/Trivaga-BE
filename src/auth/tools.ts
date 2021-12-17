import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import UserModel, { UserDocument } from "../model/user";

interface CryptObj {
  id: string;
  iat: number;
  exp: number;
}

export const JWTAuthenticate = async (user: UserDocument) => {
  // 1. given the user generates tokens (access and refresh)
  const accessToken: any = await generateJWTToken({ id: user._id });
  const refreshToken: any = await generateRefreshToken({ id: user._id });

  // 2. refresh token should be saved in db
  user.refreshToken = refreshToken;
  await user.save();

  // 3. return both the tokens
  return { accessToken, refreshToken };
};

const generateJWTToken = (payload: Object) =>
  new Promise((resolve, reject) => {
    const secret = process.env.JWT_SECRET;
    console.log("here", secret);
    console.log("here", process.env.JWT_SECRET);
    if (secret) {
      jwt.sign(payload, secret, { expiresIn: "15m" }, (err, token) => {
        if (err) reject(err);
        else resolve(token);
      });
    } else {
      console.log("Secret missing - check enviromental variables123");
    }
  });

const generateRefreshToken = (payload: Object) =>
  new Promise((resolve, reject) => {
    const secret = process.env.JWT_SECRET;
    if (secret) {
      jwt.sign(payload, secret, { expiresIn: "1 week" }, (err, token) => {
        if (err) reject(err);
        else resolve(token);
      });
    } else {
      console.error("Secret missing - check enviromental variables234");
    }
  });

export const verifyJWT = (token: string) =>
  new Promise((res, rej) => {
    const secret = process.env.JWT_SECRET;
    if (secret) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) rej(err);
        else res(decodedToken);
      });
    } else {
      console.error("Secret missing - check enviromental variables345");
    }
  });

const verifyRefreshToken = (token: string) =>
  new Promise((res, rej) => {
    const secret = process.env.JWT_SECRET;
    if (secret) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) rej(err);
        else res(decodedToken);
      });
    } else {
      console.error("Secret missing - check enviromental variables456");
    }
  });

export const verifyRefreshAndGenerateTokens = async (
  currentRefreshToken: string
) => {
  // 1. check the validity of current refresh token (exp date and integrity)
  const decodedRefreshToken: any = await verifyRefreshToken(
    currentRefreshToken
  );
  console.log(decodedRefreshToken);

  // 2. if token is valid we are going to check if it is the same in our db
  const user = await UserModel.findById(decodedRefreshToken.id);

  if (!user) throw createHttpError(404, "User not found!");

  if (user.refreshToken && user.refreshToken === currentRefreshToken) {
    // 3. if everything is fine we are going to generate a new pair of tokens
    const { accessToken, refreshToken } = await JWTAuthenticate(user);

    // 4. return tokens
    return { accessToken, refreshToken };
  } else {
    throw createHttpError(401, "Token not valid!");
  }
};
