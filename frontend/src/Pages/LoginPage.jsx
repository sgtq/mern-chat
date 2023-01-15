import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/Signup';

const Home = () => {
	const navigate = useNavigate();
	
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		
		if (user) {
			navigate('/chats');
		}
	}, []);

  return (
	<Container maxW='xl' centerContent>
		<Box
			d="flex"
			textAlign="center"
			p={3}
			bg={"white"}
			w="100%"
			m='40px 0 15px 0'
			borderRadius='lg'
			borderWidth='1px'
		>
			<Text fontSize='6xl' fontFamily='Moon dance'>{process.env.REACT_APP_NAME}</Text>
		</Box>
		  <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
			<Tabs variant='soft-rounded'>
				<TabList mb='1em'>
					<Tab w='50%'>Log in</Tab>
					<Tab w='50%'>Sign up</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Login />
					</TabPanel>
					<TabPanel>
						<Signup />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	</Container>
  )
}

export default Home