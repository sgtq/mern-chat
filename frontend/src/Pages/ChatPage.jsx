import axios from 'axios';
import { useEffect, useState } from 'react';

const Chat = () => {
	const [chats, setChats] = useState([]);

	const fetchChats = async () => {
		try {
			const { data } = await axios.get('/api/chat');
			setChats(data);
		} catch (error) {
			
		}
	}

	useEffect(() => {
		fetchChats();
	}, []);

  return (
	  <div>
		  {chats.map((chat => <div key={ chat._id }>{chat.chatName}</div>))}
	</div>
  )
}

export default Chat