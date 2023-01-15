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
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "id name email");

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

export const fetchChats = asyncHandler(async (req, res, next) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "id name email photo")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name photo email photo",
                });

                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export const createGroupChat = asyncHandler(async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields." });
    }

    try {
        var users = JSON.parse(req.body.users);
        if (users.length < 2) {
            return res.status(400).json({ message: "More than 2 users are required to form a group chat." }).send();
        }

        users.push(req.user); // After all users are created, the creator (current logged in user) is added too.

        try {
            const groupChat = await Chat.create({
                chatName: req.body.name,
                users: users,
                isGroupChat: true,
                groupAdmin: req.user,
            });

            const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
                .populate("users", "id name email photo")
                .populate("groupAdmin", "id name email photo");

            res.status(200).json(fullGroupChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export const renameGroupChat = asyncHandler(async (req, res, next) => {
    const { chatId, chatName } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName, // chatName: chatName isn't needed because it's the exact same
            },
            {
                new: true, // So it returns new values instead of old.
            }
        )
            .populate("users", "id name email photo")
            .populate("groupAdmin", "id name email photo");

        if (!updatedChat) {
            res.status(404);
            throw new Error("Chat not found");
        } else {
            res.json(updatedChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export const addToGroup = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body;

    try {
        const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
            .populate("users", "id name email")
            .populate("groupAdmin", "id name email photo");

        if (!added) {
            res.status(404);
            throw new Error("User not added to group.");
        } else {
            res.json(added);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export const removeFromGroup = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body;

    try {
        const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
            .populate("users", "id name email")
            .populate("groupAdmin", "id name email photo");

        if (!removed) {
            res.status(404);
            throw new Error("User not added to group.");
        } else {
            res.json(removed);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
