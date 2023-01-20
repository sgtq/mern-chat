import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
    },
    {
        timestamps: true,
        collection: `${process.env.MONGO_PREFIX}-messages`,
    }
);

export default mongoose.model("Message", messageSchema);
