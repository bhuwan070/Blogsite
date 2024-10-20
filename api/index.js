const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/Userd");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const app = express();
const secret = "fhfkhfhhfgkfhgh";
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

mongoose.connect(
  "mongodb+srv://bhuwanojha10:bhuwanojha100@cluster0.sl6n5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  // Check if user exists
  if (!userDoc) {
    return res.status(400).json({ error: "User not found" });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logedIn
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json("ok");
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.listen(4000, () => {
  console.log("listening to port 4000");
});
