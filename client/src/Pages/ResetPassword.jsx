import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { resetPassword } from "../Redux/Slices/AuthSlice";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

  const { resetToken } = useParams();

  const [currPass, setPass] = useState({
      password: "",
      resetToken: resetToken,
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setPass({
      ...currPass,
      [name]: value,
    });
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (!currPass.password) {
        toast.error("Please enter the new password ");
        return;
      }
      
      const response = await dispatch(resetPassword(currPass));
      if (response?.payload?.success) {
          navigate("/login");
      }

      currPass({
        password: "",
      });
  };

  return (
    <HomeLayout>
      <div className=" flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={changePassword}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">
            Create Your New Password
          </h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              {" "}
              New Password{" "}
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your new password"
              className="bg-transparent px-2 py-1 border"
              onChange={(e) => handleUserInput(e)}
              value={currPass.email}
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Reset My Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default ResetPassword;
