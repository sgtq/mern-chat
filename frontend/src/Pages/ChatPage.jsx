import { Flex } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import TopNav from '../Components/Nav/TopNav'
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';
import { useState } from 'react';

const ChatPage = () => {
	const { user } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false)

  return (
	  <div style={{ width: "100%" }}>
		{user && <TopNav />}
		<Flex d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
			{user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
			{user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
		</Flex>
	</div>
  )
}

export default ChatPage;