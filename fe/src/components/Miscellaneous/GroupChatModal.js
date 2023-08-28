import React,{useState} from 'react'
import { useDisclosure, Box, useToast, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl  } from "@chakra-ui/react"
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([[]]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {user,chats,setChats} = ChatState();

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id));
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query){
            return;
        }
        try{
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get(`/api/user?search=${search}`, config);
            setSearchResults(data);
            setLoading(false);
        }catch(error){
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }
    const handleSubmit = async() => {
        if (!groupChatName || selectedUsers.length === 0) {
            toast({
                title: "Error Occured!",
                description: "Please enter the group name and add users",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.post(`/api/chat/group`, 
                                {   name: groupChatName, 
                                    users: JSON.stringify(selectedUsers.map((u)=>u._id))
                                }, 
                                config);
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "Group Chat Created!",
                description: "Group Chat Created Successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }catch(err){
            toast({
                title: "Error Occured!",
                description: "Failed to create the group chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already added",
                description: "Please add another user",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })

            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize="35px"
                    display="flex"
                    justifyContent="center">
                    Create Group Chat
                </ModalHeader>
              <ModalCloseButton />
              <ModalBody
                display="flex"
                flexDir="column"
                alignItems="center">
                <FormControl>
                    <Input placeholder="Group Chat Name" mb={3} onChange={(e)=> setGroupChatName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input placeholder="Add Users" mb={3} onChange={(e)=> handleSearch(e.target.value)}/>
                </FormControl>
                <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map( u => (
                    <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
                ))}
                </Box>
                {/* render searched users */}
                {loading ? <div>Loading...</div> : (
                    searchResults?.slice(0,5).map(user=>(
                        <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                    ))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal