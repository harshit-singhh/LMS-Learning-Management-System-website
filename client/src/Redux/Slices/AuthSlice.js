import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  role: localStorage.getItem("role") || "",
  data: (() => {
    const data = localStorage.getItem("data");
    if (data === null || data === "undefined") {
      return {}; // Return empty object if data is null or "undefined"
    }
    try {
      return JSON.parse(data); // Try to parse JSON
    } catch (e) {
      console.error("Failed to parse JSON from localStorage:", e);
      return {}; // Return empty object if JSON parsing fails
    }
  })(),
};


// this is an action
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
      const res = axiosInstance.post("user/register", data);

      // normally as axiosInstance is a async 
    toast.promise(res, {
      loading: "Wait! creating your account",
      success: (Fulldata) => {
          return Fulldata?.data?.message;
          // this will  show the message which will come from the server
          // i.e user registered successfully.
      },
      error: "Failed to create account",
    });
      
      return (await res).data; // wait for the res to get the data.. then send the data.
      
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// =================================================================================

export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("user/login", data);
    toast.promise(res, {
      loading: "Wait! authentication in progress...",
      success: (data) => {
        return data?.data?.message;
        // we can also show our custom message here.
      },
      error: "Failed to log in",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// =================================================================================

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.post("user/logout");
    toast.promise(res, {
      loading: "Wait! logout in progress...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log out",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// =================================================================================

export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
      toast.promise(res, {
        loading: "Wait! profile update in progress...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile",
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// =================================================================================


export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = axiosInstance.get("user/me");
    return (await res).data;
  } catch (error) {
    toast.error(error.message);
  }
});


// =================================================================================

export const SendEmailforPasswordReset = createAsyncThunk("/password/resetmail", async (data) => {
  try {
    const res = axiosInstance.post(`user/reset`, data);

    // normally as axiosInstance is a async
    toast.promise(res, {
      loading: "Sending mail to your email id",
      success: (Fulldata) => {
        return Fulldata?.data?.message;
        // this will  show the message which will come from the server
        // i.e user registered successfully.
      },
      error: "Failed to send the mail, Try again",
    });

    return (await res).data; // wait for the res to get the data.. then send the data.
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
})

// =================================================================================

export const resetPassword = createAsyncThunk(
  "/resetPass",
  async (data) => {
    try {
      const res = axiosInstance.post(`user/reset/${data.resetToken}`, data);

      // normally as axiosInstance is a async
      toast.promise(res, {
        loading: "Wait! Sending reset password link to your email",
        success: (Fulldata) => {
          return Fulldata?.data?.message;
          // this will  show the message which will come from the server
          // i.e user registered successfully.
        },
        error: "Failed to reset the password, Try again",
      });

      return (await res).data; // wait for the res to get the data.. then send the data.
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
   extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
                // as the login has completed.. the action.payload will store
                // the data coming from the server
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.data = {};
            state.isLoggedIn = false;
            state.role = "";
        })
        .addCase(getUserData.fulfilled, (state, action) => {
            if(!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        });
    }
      
  
});

// export const { } = authSlice.actions;
export default authSlice.reducer;
