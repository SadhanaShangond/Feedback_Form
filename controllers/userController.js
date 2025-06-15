const bcrypt = require("bcrypt");
const User = require("../models/userModle");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });


//show pug form for registration
const showRegisterPage = (req, res) => {
  res.render("register");
};

//show pug form for login
const showLoginrPage = (req, res) => {
  res.render("login");
};

//Register User
const registerUser = async (req, res) => {
  try {
    //Get the Data
    const { username, email, password } = req.body;
    //check if the email id is there or not

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("error", {
        message: "User already Registered",
        redirect: "/api/v1/users/register",
      });
    }
    

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("login");
  } catch (error) {
    console.error(error);
    res.status(403).render("error", {
      message: "Failed to Register",
      redirect: "/api/v1/users/register",
    });
  }
};


const loginUser = async (req, res) => {
  try {
    //get the data
    const { email, password } = req.body;

    // check weather email id exist or not
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .render("error", {
          message: "No User found",
          redirect: "/api/v1/users/login",
        });
    }
    //match the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).render("error", {
        message: "Authentication Failed",
        redirect: "/api/v1/users/login",
      });
    }

    //generate a token
    let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_MESSAGE, {
      expiresIn: "1h",
    });

    //sending to cokkies
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });
    res.redirect("/api/v1/protect/feedback");
  } catch (error) {
    console.error("something went wrong", error);
    res.status(500).render("error", {
      message: "User log In failed",
      redirect: "/api/v1/users/login",
    });
  }
};


const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/api/v1/users/login");
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  showRegisterPage,
  showLoginrPage
};

