import { Router } from "express";
import { SendOtp, verifyOtp } from "../controllers/tempUser.controller.js";

const router = Router();
router.route("/send-otp").post(SendOtp);
router.route("/verify-otp").get(verifyOtp);


export default router;