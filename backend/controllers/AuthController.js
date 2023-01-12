import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, photo } = req.body;

  if (!name || !email || !password) {
    // TODO: error middleware from index.js
    res.status(400);
    throw new Error("Please enter all fields.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    // TODO: error middleware from index.js
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
    photo,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } else {
    // TODO: error middleware from index.js
    res.status(400);
    throw new Error("Error creating new User");
  }
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await User.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
