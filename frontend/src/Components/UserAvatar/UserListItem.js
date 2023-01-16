import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
    return (
        <>
            <Flex
                onClick={handleFunction}
                cursor="pointer"
                bg="£e8e8e8"
                _hover={{
                    background: "£38b2ac",
                    color: "white",
                }}
                w="100%"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                borderRadius="lg"
            >
                <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.photo} />
                <Box>
                    <Text>{user.name}</Text>
                    <Text fontSize="xs">
                        <b>Email : </b>
                        {user.email}
                    </Text>
                </Box>
            </Flex>
        </>
    );
};

export default UserListItem;
