import { Button } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Button // colorScheme does not work on Box component
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
            onClick={handleFunction}
        >
            <CloseIcon pl={1} />
            <span>&nbsp;</span>
            {user.name}
        </Button>
    );
};

export default UserBadgeItem;
