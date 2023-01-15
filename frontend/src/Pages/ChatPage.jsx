import { Box } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../Components/Nav/SideDrawer'
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';



const Chat = () => {
	const { user } = ChatState();

  return (
	<div style={{ width: "100%"}}>
		  {user && <SideDrawer />}		  
		  <Box>
			  {user && <MyChats />}
			  {user && <ChatBox />}
		  </Box>
	</div>
  )
}

export default Chat;