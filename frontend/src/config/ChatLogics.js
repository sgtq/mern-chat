import { m } from "framer-motion";

export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, msg, i, userId) => {
    // to group consecutive messages
    return (
        i < messages.length - 1 && // if this message does not exceed the array length
        (messages[i + 1].sender._id !== msg.sender._id || messages[i + 1].sender._id === undefined) && // if next message sender isn't the same as next
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    // check it's last message of the opposite user
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId && // last message isn't of current logged user
        messages[messages.length - 1].sender._id // that message exists
    );
};

// Allign all same sender messages to same margin/side
export const isSameSenderMargin = (messages, msg, i, userId) => {
    if (i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId)
        return 33;
    else if (
        (i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id && messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else {
        return "auto";
    }
};

export const isSameUser = (messages, msg, i) => {
    // if sender from msg and the messages[i-1] are same
    return i > 0 && messages[i - 1].sender._id === msg.sender._id;
};
