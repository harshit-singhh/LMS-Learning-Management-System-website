import mongoose from "mongoose";
import { model } from "mongoose";
const tempUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});


const TempUser = model('TempUser', tempUserSchema);

export default TempUser;
