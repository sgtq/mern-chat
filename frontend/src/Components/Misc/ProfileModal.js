import { ViewIcon } from "@chakra-ui/icons";
import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal isOpen={isOpen} onClose={onClose} isCentered="center">
                <ModalOverlay />
                <ModalContent d="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                    <ModalHeader fontSize="40px" fontFamily="Work sans" d="flex" justifyContent="center">
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image borderRadius="full" boxSize="150px" src={user.photo} alt={user.name} />
                        <Text>Email: {user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
