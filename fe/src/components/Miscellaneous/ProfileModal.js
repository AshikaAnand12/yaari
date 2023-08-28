// The modal component provides a solid foundation for creating dialogs, popovers, lightboxes, or whatever else
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, ModalFooter, Text, Button } from "@chakra-ui/react";
import {ViewIcon} from "@chakra-ui/icons"
import { IconButton } from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <>
            {children ?
                        <span onClick={onOpen}>{children}</span> : 
                        (<IconButton display="flex" icon={<ViewIcon/>} onClick={onOpen}/>)
            }
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                        borderRadius="full"
                        boxSize="150px"
                        src={user.pic}
                        alt={user.name}
                        />
                        <Text
                        fontSize={{ base: "20px", md: "24px" }}
                        fontFamily="Work sans"
                        >
                        Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} colorScheme='red' >Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
