import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../Helpers/axiosInstance";
import { isEmail, isValidPassword } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";
import { createAccount } from "../Redux/Slices/AuthSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  function getImage(event) {
    event.preventDefault();
    // getting the image
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function createNewAccount(event) {


    if (!otpVerified) {
      toast.error("Please verify your OTP before signing up.");
      return;
    }
    event.preventDefault();
    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.fullName ||
      !signupData.avatar
    ) {
      toast.error("Please fill all the details");
      return;
    }

    // checking name field length
    if (signupData.fullName.length < 5) {
      toast.error("Name should be atleast of 5 characters");
      return;
    }
    // checking valid email
    if (!isEmail(signupData.email)) {
      toast.error("Invalid email id");
      return;
    }
    // checking password validation
    if (!isValidPassword(signupData.password)) {
      toast.error(
        "Password should be 6 - 16 character long with atleast a number and special character"
      );
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    // dispatch create account action
    const response = await dispatch(createAccount(formData));
    if (response?.payload?.success) navigate("/");

    setSignupData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
    });
    setPreviewImage("");
  }


  // =======================================================================
  // OTP PART

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const response = axiosInstance.post("/tempUser/send-otp", signupData );
      toast.promise(response, {
        loading: "Sending OTP to your mail",
        success: "OTP sent successfully",
        error: "Failed to send the OTP",
      });
      const Response = await response;
      // console.log(Response);
      if (Response?.data?.success) {
        setOtpSent(true);
      }
    } catch (err) {
      toast.error(err);
    }


  }


  const verifyOtp = async (e) => {
    e.preventDefault();

    const data = {
      email: signupData.email,
      otp : otp,
    }
    try {
      const response = axiosInstance.get("/tempUser/verify-otp", {params  : data});
      toast.promise(response, {
        loading: "Wait!! Verifying your OTP",
        success: (res) => {
          return res.data.message;
        } 
        // error: "Failed to  the OTP",
      });
      const Response = await response;
      // console.log(Response);
      if (Response?.data?.status) {
        setOtpVerified(true);
        console.log(`otp verified : ${otpVerified}`);
        
      }

      
    } catch (err) {
      toast.error(err);
    }

  }

  

  return (
    <HomeLayout>
      <div className="flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>

          <label htmlFor="image_uploads" className="cursor-pointer">
            {previewImage ? (
              <img
                className="w-24 h-24 rounded-full m-auto"
                src={previewImage}
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={getImage}
            className="hidden"
            type="file"
            name="image_uploads"
            id="image_uploads"
            accept=".jpg, .jpeg, .png, .svg"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              {" "}
              Name{" "}
            </label>
            <input
              type="text"
              required
              name="fullName"
              id="fullName"
              placeholder="Enter your name.."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.fullName}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              {" "}
              Email{" "}
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email.."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>

          <button
            onClick={sendOtp}
            className="mt-2 bg-gray-500 hover:bg-gray-400 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Send OTP
          </button>

          {otpSent && (
            <div className="flex flex-col gap-1">
              <label htmlFor="otp" className="font-semibold">
                {" "}
                OTP{" "}
              </label>
              <input
                type="otp"
                required
                name="otp"
                id="otp"
                placeholder="Enter your otp.."
                className="bg-transparent px-2 py-1 border"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
              <button
                onClick={verifyOtp}
                className={`mt-2 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer ${
                  otpVerified
                    ? "bg-green-500 hover:bg-green-400"
                    : "bg-gray-500 hover:bg-gray-400"
                }`}
              >
                {otpVerified ? "Verified" : "Verify OTP"}
              </button>
            </div>
          )}

          

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              {" "}
              Password{" "}
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password.."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Create account
          </button>

          <p className="text-center">
            Already have an account ?{" "}
            <Link to="/login" className="link text-accent cursor-pointer">
              {" "}
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signup;
