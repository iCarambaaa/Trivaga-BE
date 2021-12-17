import mongoose, { Model, Document } from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

export interface User {
  email: string;
  password?: string;
  role: string;
  refreshToken?: string;
  accessToken?: string;
}

export interface UserDocument extends Document, User {}

export interface UserModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    plainPw: string
  ): Promise<UserDocument | null>;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "guest", enum: ["guest", "host"] },
    refreshToken: { type: String },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// BEFORE saving the user in database, hash the password
UserSchema.pre("save", async function (next) {
  // NO ARROWS here
  const newUser = this;
  const plainPassword = newUser.password;
  if (plainPassword) {
    if (newUser.isModified("password")) {
      const hash = await bcrypt.hash(plainPassword, 11);
      newUser.password = hash;
    }
    next();
  } else {
    console.log("ERR: NO PW ARRIVED");
  }
});

// don't send password back in res
UserSchema.methods.toJSON = function () {
  // this function is called automatically by express EVERY TIME it does res.send()

  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.__v;
  delete userObject.password; // THIS IS NOT GOING TO AFFECT THE DATABASE

  return userObject;
};

// check request headers basic auth here for matches in mongoDB
UserSchema.statics.checkCredentials = async function (email, plainPassword) {
  // 1. find the author by email
  const author = await this.findOne({ email }); // "this" refers to the authorModel

  if (author) {
    // 2. if author is found --> compare plainPassword with hashed one
    const isMatch = await bcrypt.compare(plainPassword, author.password);
    if (isMatch) {
      // 3. if they match --> return a proper response
      return author;
    } else {
      // 4. if they don't --> return null
      return null;
    }
  } else {
    return null; // also if email is not ok --> return null
  }
};

export default model<UserDocument, UserModel>("User", UserSchema);
