import { ViewIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = ChatState();

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const handleRenameGroup = async () => {
        if (!groupChatName) {
            toast({
                title: "Please fill new Group Chat name",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setRenameLoading(true);

            const { data } = await axios.put(
                "/api/chat/group-rename",
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );
            toast({
                title: "Group Name changed!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }

        setGroupChatName("");
    };

    const handleUserSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error fetching users!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const handleAddUser = async (newUser) => {
        // validate added user isn't already in the group chat
        if (selectedChat.users.find((u) => u._id === newUser._id)) {
            toast({
                title: "User is already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        // validate logged in user is admin
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admins can add someone to the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.put(
                "/api/chat/group-add",
                {
                    chatId: selectedChat._id,
                    userId: newUser._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error adding user!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const handleRemoveUser = async (delUser) => {
        // validate user to delete isn't admin but allows admin to delete himself
        if (selectedChat.groupAdmin._id !== user._id && delUser._id !== user._id) {
            toast({
                title: "Only admins can remove others!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put(
                "/api/chat/group-remove",
                {
                    chatId: selectedChat._id,
                    userId: delUser._id,
                },
                config
            );

            setSelectedChat(delUser._id === user._id ? "" : data);
            setFetchAgain(!fetchAgain);
            fetchMessages(); // refresh all messages
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent d="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                    <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleRemoveUser(user)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder={selectedChat.chatName}
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRenameGroup}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl display="flex">
                            <Input
                                placeholder="Add user to group"
                                mb={1}
                                onChange={(e) => handleUserSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemoveUser(user)} colorScheme="red">
                            Leave Group
                        </Button>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
