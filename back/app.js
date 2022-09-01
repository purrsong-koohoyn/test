const express = require("express");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();
passportConfig();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("ok");
});
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);

app.listen(3065, () => {
  console.log("server is working, port: 3065");
});
