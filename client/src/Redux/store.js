import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./Slices/AuthSlice";
import courseSliceReducer from "./Slices/CourseSlice";
import lectureSliceReducer from "./Slices/LectureSlice";
import RazorpaySlice from "./Slices/RazorpaySlice";
import statSliceReducer from "./Slices/StatSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    course: courseSliceReducer,
    razorpay: RazorpaySlice,
    lecture: lectureSliceReducer,
    stat: statSliceReducer,
  },
  devTools: true,
});

export default store;
