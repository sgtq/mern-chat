import { Box } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import TopNav from '../Components/Nav/TopNav'
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';



const ChatPage = () => {
	const { user } = ChatState();

  return (
	  <div style={{ width: "100%" }}>
		{user && <TopNav />}
		<Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
			{user && <MyChats />}
			{user && <ChatBox />}
		</Box>
	</div>
  )
}

export default ChatPage;