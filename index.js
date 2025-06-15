const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRouter = require("./routes/userRouts.js");
const router = require("./routes/protectedrout.js");
const cookieParser = require("cookie-parser");
const path = require("path");
dotenv.config({ path: "./.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//connection to database
connectDB();

//set pug as view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

//Routing midlleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/protect", router);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.....`);
});

// Root route: renders a form that POSTs to /api/v1/users/register
// app.get("/", (req, res) => {
//   res.send(`
//     <h2>Register</h2>
//     <form action="/api/v1/users/register" method="POST">
//       <input name="username" placeholder="Username" required />
//       <input type="password" name="password" placeholder="Password" required />
//       <button type="submit">Register</button>
//     </form>
//   `);
// });
 
