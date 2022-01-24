const router = require("express").Router();
const User = require("../models/user");
const session = { session: false };
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");

// =================================/=========================================

const profile = (req, res, next) => {
  res.status(200).json({
    message: "profile",
    user: req.user,
    token: req.query.secret_token,
  });
};
router.get("/", passport.authenticate("jwt", session), profile);

// ================================register user===============================
// takes the authenticated req and returns a response
const register = async (req, res, next) => {
  try {
    req.user.name
      ? res.status(201).json({ msg: "user registred", user: req.user })
      : res.status(401).json({ msg: "User already exists" });
  } catch (error) {
    next(error);
  }
};
// http://localhost/user/createuser
// register router - authenticate using registerStrategy (names "register") and passes on the register function defined above
router.post(
  "/registeruser",
  passport.authenticate("register", session),
  register
);
// ==================================login==================================

const login = async (req, res, next) => {
  passport.authenticate("login", (error, user) => {
    try {
      if (error) {
        res.status(500).json({ message: "Internal Server Error" });
      } else if (!user) {
        res.status(401).json(info);
      } else {
        const loginFn = (error) => {
          if (error) {
            return next(error);
          } else {
            const userData = { id: user.id, name: user.name };
            const data = {
              user,
              token: jwt.sign({ user: userData }, process.env.SECRET_KEY),
            };
            res.status(200).json(data);
          }
        };
        req.login(user, session, loginFn);
      }
    } catch (error) {
      return next(error);
    }
    // IFFY - Immediately Invoked Function Expression
  })(req, res, next);
};
router.post("/userlogin", login);
// =================================routes==================================

// get all users
router.get("/getallusers", async (req, res) => {
  const allUsers = await User.findAll({
    attributes: ["id", "name"],
  });
  res.status(200).json({ msg: "worked", data: allUsers });
});

// create a user
// router.post("/registeruser", async (req, res) => {
//   const salt = await bcrypt.genSalt(saltRounds);
//   const hash = await bcrypt.hash(req.body.passwordHash, salt);
//   const user = await User.create({
//     name: req.body.name,
//     passwordHash: hash,
//   });
//   res
//     .status(201)
//     .json({ msg: "worked", name: req.body.name, passwordHash: hash });
// });

// delete all users
router.delete("/deleteallusers", async (req, res) => {
  await User.truncate();
  res.status(200).json({ msg: "deleted" });
});

// get a single user
router.get("/:id", async (req, res) => {
  const user = await User.findAll({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ msg: "worked", user: user });
});

// update a single user
router.put("/:id", async (req, res) => {
  await User.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({ msg: "worked", data: req.body });
});

// delete a single user
router.delete("/:id", async (req, res) => {
  await User.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ msg: "deleted user", id: req.params.id });
});

module.exports = router;
