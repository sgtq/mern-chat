import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [photo, setPhoto] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const photoDetails = (photo) => {
        setLoading(true);
        if (photo === undefined || !(photo.type === "image/jpeg" || photo.type === "image/png")) {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        } else {
            const data = new FormData();
            data.append("file", photo);
            data.append("upload_preset", "mern-chat");
            //data.append("cloud_name", `${process.env.REACT_APP_CLOUDINARY_ACCOUNT}`);
            fetch(`${process.env.REACT_APP_CLOUDINARY_URL}`, {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPhoto(data.url.toString()); // Using setinfo instead
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    };

    const handleSubmit = () => {
        //
    };

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your name" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm_password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="photo">
                <FormLabel>Upload your Picture</FormLabel>
                <Input type="file" p={1.5} accept="image/*" onChange={(e) => photoDetails(e.target.files[0])} />
            </FormControl>
            <Button colorScheme="blue" w="100%" style={{ marginTop: 15 }} onClick={handleSubmit} isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;
