import mongoose from "mongoose";
import { Model, Document } from "mongoose";

const bcrypt = require("bcrypt");

export interface UsersDocument extends Document  {
    _id?: string;
    name: string
    email: string;
    password: string;
    role: string;
}

interface UserModel extends Model<UsersDocument> {
    verifyCredentials(): any;
}

const { Schema, model } = mongoose

const UserSchema = new Schema<UsersDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enums: ['Host', 'Guest'] }
})

UserSchema.pre("save", async function (next) {
    const newUser = this;

    const plainPw = newUser.password;

    console.log("=======================> plain password before hash", plainPw);
    if (newUser.isModified("password")) {
        const hash = await bcrypt.hash(plainPw, 10);
        newUser.password = hash;
        console.log("=======================> plain password after hash", hash);
    }
    next();
});

UserSchema.methods.toJSON = function () {
    const userDoc = this;
    const userObject = userDoc.toObject();
    delete userObject.password;
    delete userObject.__v;

    return userObject;
};

// UserSchema.statics.verifyCredentials = async function (email: string, plainPw: string) {
//     const user = await this.findOne({ email });

//     if (user) {
//         const isMatch = await bcrypt.compare(plainPw, user.password);
//         if (isMatch) {
//             console.log("matched!!!!");
//             return user;
//         } else {
//             return null;
//         }
//     } else {
//         return null;
//     }
// };

export default model('User', UserSchema)