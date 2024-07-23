import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import miscRoutes from "./routes/miscellaneous.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();
app.use(express.json());
// encoded url wagera se params nikalne me / parse karne me help karta he
app.use(express.urlencoded({ extended: true }));

// The credentials option is set to true to indicate that the server allows the browser to send cookies and HTTP authentication information with cross-origin requests.
// This is important if your frontend and backend are on different domains and you need to maintain user sessions or handle authentication through cookies.

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/ping", function (req, res) {
  res.send("/pong");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1", miscRoutes);

app.all("*", (req, res) => {
  res.status(404).send("OOPS!! 404 route not found");
});

app.use(errorMiddleware);

export default app;
