import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Misc/ProfileModal";
import UpdateGroupChatModal from "./Misc/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        fontFamily="Work sans"
                        pb={3}
                        px={2}
                        w="100%"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#e8e8e8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        Messages Here
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting.
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
