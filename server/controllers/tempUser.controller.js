
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import crypto from "crypto";
import TempUser from '../models/TempUser.model.js';
import { TIMEOUT } from "dns";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";

export const SendOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    console.log("before any checks");

    if (!email) {
        return next(new AppError("email is required", 400));
    }

    console.log("check1 completed")

    const user = User.findOne({ email });
    if (user) {
         return next(new AppError("User with this email already exists", 400));
    }

      console.log("check2 completed");

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 3600000; // otp expires in 1 hour

    // creating a new temp user

    const tempuser = TempUser.create({
        email: email,
        otp: otp,
        otpExpiry: otpExpiry,
    })

     

    if (!tempuser) {
        return next(new AppError("Something went wrong", 400));
    }

     console.log("temp user created");

    //sending mail

    const subject = "OTP Verification";
    const message = `Your OTP is - ${otp}`;

    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your mail id",
        });

    }
    catch (error) {

        tempuser.otp = undefined;
        tempuser.otpExpiry = undefined;

        await tempuser.save();

         return next(
           new AppError(
             error.message || "Something went wrong, please try again.",
             500
           )
         );

    }
    
});



export const verifyOtp = asyncHandler(async (req, res, next) =>{
    const { email, otp } = req.query;
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser || tempUser.otp !== otp || tempUser.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({
      status: true,
      message: "OTP verified successfully",
    });

})
