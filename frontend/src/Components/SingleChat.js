import "./styles.css";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import Lottie from "lottie-react";
import typingAnimation from "./../animations/typing.json";

import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Misc/ProfileModal";
import UpdateGroupChatModal from "./Misc/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";

const ENDPOINT = "http://localhost:5000"; // set temporarily
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat } = ChatState();

    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id); // send to create new room
        } catch (error) {
            toast({
                title: "Failed fetching message history.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    // create socket on load
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));

        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    // fetch messages on selecting chat
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat; // to keep the backup to compare and decide
    }, [selectedChat]);

    // update messages on every receive
    useEffect(() => {
        socket.on("msg received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // show notification
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) {
            return;
        }

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        // stop typing notification
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000; // 3 minutes
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);

            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                socket.emit("new msg", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Failed sending message",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

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
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
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
                        {loading ? (
                            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                        ) : (
                            <>
                                <div className="messages">
                                    <ScrollableChat messages={messages} />
                                </div>
                            </>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? (
                                <div>
                                    <Lottie
                                        animationData={typingAnimation}
                                        loop={true}
                                        rendererSettings={{
                                            preserveAspectRatio: "xMidYMid slice",
                                        }}
                                        style={{ width: "70px", marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant="filled"
                                bg="#e0e0e0"
                                placeholder="Enter a message..."
                                onChange={handleTyping}
                                value={newMessage}
                            />
                        </FormControl>
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
