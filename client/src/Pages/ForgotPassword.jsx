import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { SendEmailforPasswordReset } from "../Redux/Slices/AuthSlice";
const ForgotPassword = () => {
  const dispatch = useDispatch();


  const [data, setData] = useState({
      email: "",
      
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const ResetPassword = async (e) => {
    e.preventDefault();
    if (!data.email) {
      toast.error("Please enter the email");
      return;
    }

    // dispatch create account action
    await dispatch(SendEmailforPasswordReset(data));
    // if (response?.payload?.success) navigate("/");

    setData({
      email: "",
    });
  };

  return (
    <HomeLayout>
      <div className=" flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={ResetPassword}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">
            Forgot Your Password ?
          </h1>
          <h1 className="text-center font-semibold">
            If you have forgotten your password, please enter your account's
            email address below and click the "Reset My Password" button. You
            will recieve an email that contains a link to set a new password.
          </h1>
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
              onChange={(e) => handleUserInput(e)}
              value={data.email}
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Reset My Password
          </button>

          <Link
            to="/login"
            className="link text-accent cursor-pointer text-center"
          >
            {" "}
            Return to login Page
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
};

export default ForgotPassword;
