import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// GET /api/user/?search=VAR
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: "i" } }, // "i" case insensitive
                  { email: { $regex: req.query.search, $options: "i" } },
              ],
          }
        : {};

    const users = await User.find(keyword)
        .find({ _id: { $ne: req.user._id } })
        .select("-password -isAdmin"); // Find user that NOT EQUAL to current logged in user
    res.send(users);
});
