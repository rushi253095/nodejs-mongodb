import { Schema, model as Model } from "mongoose";

import modelConstants from "../constants/modelConstants";

const userSchema = new Schema({
  fullName: { type: String },
  file: {
    default: "",
    type: String,
  },
  email: {
    default: "",
    type: String,
  },
  password: {
    default: "",
    type: String,
  },
  status: {
    default: true,
    type: Boolean,
  },
  skills: [{
    type: String,
  }],
}, {
  timestamps: true,
  versionKey: false,
  collation: { locale: 'en', strength: 1 },
});

const UserModel = Model("User", userSchema);
export default UserModel;
