import asyncHandler from "express-async-handler";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// POST /api/message/
export const sendMessage = asyncHandler(async (req, res, next) => {
    const { chatId, content } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request.");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name photo");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name photo email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// GET /api/message/:chatId
export const getAllMessages = asyncHandler(async (req, res, next) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name photo email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
