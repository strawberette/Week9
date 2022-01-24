require("dotenv").config();
const passport = require("passport");
const express = require("express");
const connection = require("./connection");
const User = require("./models/user");
const userRouter = require("./routes/user");
const {
  registerStrategy,
  loginStrategy,
  verifyStrategy,
} = require("./middleware/auth");

// const createUsers = async () => {
//   const users = [
//     {
//       name: "Genonzio",
//       password: "bandiziole",
//     },
//     {
//       name: "Genoveffa",
//       password: "calepie",
//     },
//   ];
//   users.map((user) => {
//     // const salt = await bcrypt.genSalt(saltRounds);
//     // const hash = await bcrypt.hash(user.password, bcrypt.genSalt(saltRounds));
//     User.create({
//       name: user.name,
//       passwordHash: user.password,
//     });
//   });
// let salt = await bcrypt.genSalt(saltRounds);
// let hash = await bcrypt.hash("bandiziole", salt);
// await User.create({
//   name: "Genonzio",
//   passwordHash: hash,
// });
// salt = await bcrypt.genSalt(saltRounds);
// hash = await bcrypt.hash("calepie", salt);
// await User.create({
//   name: "Genoveffa",
//   passwordHash: "hash",
// });
// };

const app = express();
app.use(express.json());
app.use("/user", userRouter);

// app.use(passport.initialize());
passport.use("register", registerStrategy);
passport.use("login", loginStrategy);
passport.use(verifyStrategy);

// http://localhost/user/getallusers - sends request (req)
// userRouter is a collections of routes gathered in routes

app.listen(process.env.PORT, () => {
  connection.authenticate();
  User.sync({ alter: true });
  // createUsers();
  console.log("App is online");
});
