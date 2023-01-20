import {
    Avatar,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "../Misc/ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../User/UserListItem";

const TopNav = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user, setSelectedChat, chats, setChats } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occurred!",
                description: "Failed to load the Search results.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    return (
        <>
            <Flex justifyContent="space-between" w="100%" bg="white" borderWidth="5px">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search" />
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">
                    {process.env.REACT_APP_NAME}
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList></MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.photo} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Flex>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Flex pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>
                                <i className="fas fa-search" />
                            </Button>
                        </Flex>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default TopNav;
