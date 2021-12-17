import express from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import AccomodationModel from "../model/accomodation";
import UserModel from "../model/user";
import { JWTAuthMiddleware } from "../auth/token";
import { JWTAuthenticate, verifyRefreshAndGenerateTokens } from "../auth/tools";
import { RoleCheckMiddleware } from "../auth/roleCheck";

const UserRouter = express.Router();

UserRouter.route("/register").post(async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body); // here is validation phase of req.body // expecting email, pw, role
    const { _id } = await newUser.save(); // here we save to DB also destructuring newPost to send only _id back to FE
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

UserRouter.route("/login").post(async (req, res, next) => {
  try {
    // 1. Get credentials from req.body
    const { email, password } = req.body;
    console.log(email, password);
    // 2. Verify credentials
    const user = await UserModel.checkCredentials(email, password);
    console.log("here", user);
    if (user) {
      // 3. If credentials are fine we are going to generate an access token
      const { accessToken, refreshToken } = await JWTAuthenticate(user);
      res.send({ accessToken, refreshToken });
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

UserRouter.post("/refreshToken", async (req, res, next) => {
  try {
    // 1. Receive the current refresh token from req.body
    const { refreshToken: currentRefreshToken } = req.body;
    console.log(currentRefreshToken);
    // 2. Check the validity of that (check if it is not expired, check if it hasn't been compromised, check if it is in db)
    const { accessToken, refreshToken } = await verifyRefreshAndGenerateTokens(
      currentRefreshToken
    );
    // 3. If everything is fine --> generate a new pair of tokens (accessToken and refreshToken)

    // 4. Send tokens back as a response
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

UserRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send({
      users,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

UserRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    res.send({
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

UserRouter.get(
  "/me/accommodation",
  JWTAuthMiddleware,
  RoleCheckMiddleware,
  async (req, res, next) => {
    try {
      const accomodations = await AccomodationModel.find({
        host: req.user._id,
      });
      res.send({
        accomodations,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default UserRouter;
