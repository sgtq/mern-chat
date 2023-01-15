import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const chatSchema = mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
            required: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
            required: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    {
        timestamps: true,
        collection: `${process.env.MONGO_PREFIX}-chats`,
    }
);

export default mongoose.model("Chat", chatSchema);
