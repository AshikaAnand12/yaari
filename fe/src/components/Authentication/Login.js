import { FormControl, VStack, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import {React, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const Login = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const [email,setEmail] = useState('')

  const [password,setPassword] = useState('')
  const [show,setShow] = useState(false)

  const [loading,setLoading] = useState(false)

  const submitHandler = async() => {
    setLoading(true)
    if(!email || !password){
      toast({
        title: "Please fill all the fields!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setLoading(false)
    }
    else{
      try{
        const config = {
          headers:{
            "Content-Type":"application/json",
          }
        }
        const {data} = await axios.post("/api/user/login",{email,password},config)

      // localStorage.setItem("userInfo", JSON.stringify(data));: This code stores the data object as a JSON string in the browser's local storage with the key "userInfo".
      // Local storage is a storage feature in web browsers that allows web applications to save data locally on a user's device, even after closing the browser.
      // To retrieve the data, use localStorage.getItem("userInfo") and then convert the JSON string back to an object using JSON.parse().
        localStorage.setItem("userInfo",JSON.stringify(data))
        navigate("/chat")
        setLoading(false)
      }catch(err){
        toast({
          title: "Something went wrong!",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });

        setLoading(false)
      }
    }
  }
  
  return (
    <VStack spacing={4}>
      <FormControl id="loginemail" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter your email ID" onChange={(e)=>setEmail(e.target.value)}/>
      </FormControl>

      <FormControl id="loginpassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input 
              type = {show?'text':'password'} 
              placeholder='Enter your password' 
              onChange={(e)=>setPassword(e.target.value)}>
          </Input>
          <InputRightElement width="4rem" p={1}>
            <Button h="1.75rem" size="md" onClick={()=>setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>

    </VStack>
  )
}

export default Login