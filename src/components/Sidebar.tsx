import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  IoChatboxEllipsesOutline,
  IoEllipsisVerticalOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useAuth, useUserDetails } from "../context/AuthContext";
import { useCallback, useState } from "react";
import { chatCollection, userCollection } from "@db/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import Contact from "@component/Contact";
import firebase from "firebase/compat/app";

/**
 * Sidebar for Contacts
 * @component
 **/
export default function Sidebar() {
  // useDisclosure for starting a new chat
  const { isOpen, onOpen, onClose } = useDisclosure();
  // The person to send message , his or her username
  const [inputUsername, setChatUsername] = useState("");
  // The message authenticated user is supposed to send
  const [message, setMessage] = useState("");
  // Loading chat send
  const [loadingCreateChat, setLoadingCreateChat] = useState(false);
  // Authenticated user details
  const { user, username } = useUserDetails();
  // Toast component ChakraUI
  const toast = useToast();
  // Sign-out function
  const { signOut } = useAuth();

  // Chats that contain authenticated user
  const userChatRef = chatCollection().where(
    "users",
    "array-contains",
    username
  );

  // Chat snapshot
  const [chatSnapshot, loading] = useCollection(userChatRef as any);

  // Check if chat exists with input username
  const checkChatExists = () =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((_username) => _username === inputUsername)
          ?.length > 0
    );

  // Get user data
  const checkUser = async (_username) => {
    return await userCollection()
      .where("username", "==", _username)
      .limit(1)
      .get();
  };

  // Check if user exists
  const checkUserDoesNotExist = async () => {
    const users = await checkUser(inputUsername);
    const userList = [];
    users.forEach((doc) => {
      userList.push(doc.data());
    });
    return userList.length === 0;
  };

  // Create new chat with written username
  const createChat = async () => {
    setLoadingCreateChat(true);
    const userDoesNotExists = await checkUserDoesNotExist();
    const chatExists = checkChatExists();
    if (userDoesNotExists) {
      setChatUsername("");
      toast({
        title: "User not found",
        description: `User with ${inputUsername} is not available`,
        status: "error",
        isClosable: true,
        duration: 10000,
      });
    } else if (chatExists) {
      setChatUsername("");
      toast({
        title: "Chat exists",
        description: `Chat with ${inputUsername} already exists`,
        status: "error",
        isClosable: true,
        duration: 10000,
      });
    } else {
      chatCollection()
        .add({
          users: [username, inputUsername],
          updated: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((r) => {
          chatCollection()
            .doc(r.id)
            .collection("messages")
            .add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              message: message,
              user: username,
              photoURL: user.photoURL,
            })
            .then()
            .catch();
        });
    }
    setLoadingCreateChat(false);
  };

  // Compare updated<Timestamp> ascending
  function compare(a, b) {
    if (!a.updated) {
      return -1;
    }
    if (!b.updated) {
      return 1;
    }
    if (a.updated.toDate() > b.updated.toDate()) {
      return -1;
    }
    if (a.updated.toDate() < b.updated.toDate()) {
      return 1;
    }
    return 0;
  }

  // Chat lists filtered ordered as updated[timestamp] ascending
  const chatLists = useCallback(() => {
    const chat = [];
    chatSnapshot?.docs.map((data) => {
      chat.push({ ...data.data(), id: data.id, updated: data.data().updated });
    });
    chat.sort(compare);
    return chat;
  }, [chatSnapshot]);
  return (
    <>
      <Box
        className={"sidebar"}
        display={"flex"}
        flexDirection={"column"}
        p={"1rem 2rem"}
        maxH={"100vh"}
        height={"100vh"}
      >
        <Flex
          position={"sticky"}
          top={"0"}
          background={"#fff"}
          zIndex={1}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={"0.5rem 0"}
          border-bottom={"1px solid #f7f7f7"}
        >
          <Flex gap={"10px"} alignItems={"center"}>
            <Avatar
              cursor={"pointer"}
              transition={"all 0.25s"}
              _hover={{ opacity: 0.7 }}
              src={user.photoURL}
            />
            <Text color={"gray.600"}>{username}</Text>
          </Flex>
          <Flex gap={"1rem"}>
            <IconButton aria-label={"Chat"}>
              <IoChatboxEllipsesOutline />
            </IconButton>
            <Menu>
              <MenuButton as={Button}>
                <IoEllipsisVerticalOutline />
              </MenuButton>
              <MenuList>
                <MenuGroup>
                  <MenuItem onClick={signOut}>Logout</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        <Stack spacing={5}>
          <InputGroup size={"md"}>
            <InputLeftElement bg={"transparent"} pointerEvents="none">
              <IoSearchOutline color={"gray.300"} />
            </InputLeftElement>
            <Input placeholder={"Search"} />
          </InputGroup>
          <Button onClick={onOpen}>New Chat +</Button>
        </Stack>
        <Stack
          paddingY={"20px"}
          spacing={5}
          overflowY={"auto"}
          display={"flex"}
          flexDirection={"column"}
          flex={"auto"}
        >
          {loading && (
            <>
              <Box display={"flex"} padding={"1rem 0"} gap={"10px"} bg="white">
                <SkeletonCircle size="12" />
                <SkeletonText flex={1} noOfLines={2} spacing="4" />
              </Box>
              <Box display={"flex"} padding={"1rem 0"} gap={"10px"} bg="white">
                <SkeletonCircle size="12" />
                <SkeletonText flex={1} noOfLines={2} spacing="4" />
              </Box>
            </>
          )}
          {chatLists().map((chat) => (
            <Contact
              key={chat.id}
              chat={chat}
              id={chat.id}
              username={username}
            />
          ))}
        </Stack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start chat </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Type Username</FormLabel>
              <Input
                value={inputUsername}
                onChange={(e) => {
                  setChatUsername(e.target.value);
                }}
                placeholder="Username"
              />
            </FormControl>
            <FormControl pt={"1rem"}>
              <FormLabel>Your message</FormLabel>
              <Input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                placeholder="message"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={createChat}
              disabled={
                !inputUsername || inputUsername === username || !message
              }
              colorScheme="blue"
              isLoading={loadingCreateChat}
              type={"submit"}
              mr={3}
            >
              Chat
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
