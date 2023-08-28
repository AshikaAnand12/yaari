import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  const navigate = useNavigate()
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if(user){
      navigate('/chat')
    }
  },[navigate])

  return (
    <div>
      <Container maxW="lg" centerContent>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={50}
        bg="white"
        w="100%"
        m="100px 0 15px 0"
        borderRadius="lg"
        borderWidth="2px"
      >
        <Text fontSize="4xl">
          Ashika's chatroom
        </Text>
      </Box>

        <Box 
          bg="white"
          w="100%"
          p={50}
          borderRadius="lg"
          borderWidth="2px"
          >
            <Tabs size='md' variant='enclosed'>
              <TabList mb="1.5em">
                  <Tab width="50%">Login</Tab>
                  <Tab width="50%">Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login/>
                </TabPanel>
                <TabPanel>
                  <SignUp/>
                </TabPanel>
              </TabPanels>
            </Tabs>
        </Box>
      </Container>
    </div>
  )
}

export default HomePage