import asyncHandler from "express-async-handler";
import Mongoose from "mongoose";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const accessChat = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        console.error("UserId param not sent with request.");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
    })
        .populate("users", "-password") // populates User relation from model, without password attribute
        .populate("latestMessage");

    // If it exists
    if (isChat.length > 0) {
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name photo email",
        });

        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

export const fetchChats = asyncHandler(async (req, res, next) => {});

export const createGroupChat = asyncHandler(async (req, res, next) => {});

export const renameGroupChat = asyncHandler(async (req, res, next) => {});

export const removeFromGroup = asyncHandler(async (req, res, next) => {});

export const addToGroup = asyncHandler(async (req, res, next) => {});
