import React, { useState } from 'react'
import  { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [show, setShow] = useState(false)
  const [password, setPassword] = useState('')

  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmPassword, setConfirmPassowrd] = useState('')

  const [picLoading, setPicLoading] = useState(false)
  const [pic, setPic] = useState('')
  const toast = useToast()


  const navigate = useNavigate()
  
  const submitHandler = async() => {
    setPicLoading(true)
    if(!name || !email || !password || !confirmPassword){
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false)
      return
    }
    else if(password !== confirmPassword){
      toast({
        title: "Passwords do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    else{
      try{
        const config = {
          headers:{
            "Content-Type":"application/json"
          },
          method:"POST",
        }
        const {data} = await axios.post("/api/user",{ name, email, password, pic },config)
        localStorage.setItem("userInfo",JSON.stringify(data))
        setPicLoading(false)
        navigate('/chat')
      }catch(err){
        console.log(err)
      }
    }

  }

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dzm7jcqko");
      fetch("https://api.cloudinary.com/v1_1/dzm7jcqko/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
      <VStack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input 
              placeholder='Enter your name' 
              onChange={(e)=>setName(e.target.value)}>
          </Input>
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input 
              placeholder='Enter your email ID' 
              onChange={(e)=>setEmail(e.target.value)}>
          </Input>
        </FormControl>
        <FormControl id="password" isRequired>
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
        <FormControl id="confirmpassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input 
                type={showConfirm?'text':'password'} 
                placeholder='Confirm your password' 
                onChange={(e)=>setConfirmPassowrd(e.target.value)}>
            </Input>
            <InputRightElement width="4rem" p={1}>
              <Button h="1.75rem" size="md" onClick={()=>setShowConfirm(!showConfirm)}>
                {showConfirm ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="photo">
          <FormLabel>Photo</FormLabel>
          <Input
            type='file'
            p={1.5}
            accept='image/*'
            onChange={(e)=> postDetails(e.target.files[0])}>
          </Input>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={picLoading}
        >
          Sign Up
        </Button>
      </VStack>
  )
}

export default SignUp