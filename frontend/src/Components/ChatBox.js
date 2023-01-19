import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const ChatBox = () => {
    const { user, selectedChat } = ChatState();
    return <Box>Single Chat</Box>;
};

export default ChatBox;
