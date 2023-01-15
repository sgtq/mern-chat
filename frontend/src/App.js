import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "./Pages/LoginPage";
import Chat from "./Pages/ChatPage";
import ChatProvider from "./Context/ChatProvider";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
    return (
        <div className="App">
            <ChakraProvider>
                <BrowserRouter>
                    <ChatProvider>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/chats" element={<Chat />} />
                        </Routes>
                    </ChatProvider>
                </BrowserRouter>
            </ChakraProvider>
        </div>
    );
}

export default App;
