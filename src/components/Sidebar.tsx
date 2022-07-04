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
  MenuDivider,
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
import { useState } from "react";
import { chatCollection, userCollection } from "@db/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import Contact from "@component/Contact";

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputUsername, setEmail] = useState("");
  const [loadingCreateChat, setLoadingCreateChat] = useState(false);
  const { user, username } = useUserDetails();
  const toast = useToast();
  const { signOut } = useAuth();

  const userChatRef = chatCollection().where(
    "users",
    "array-contains",
    username
  );
  const [chatSnapshot, loading] = useCollection(userChatRef as any);

  const checkChatExists = () =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((_username) => _username === inputUsername)
          ?.length > 0
    );

  const checkUser = async (_username) => {
    return await userCollection()
      .where("username", "==", _username)
      .limit(1)
      .get();
  };

  const checkUserDoesNotExist = async () => {
    const users = await checkUser(inputUsername);
    const userList = [];
    users.forEach((doc) => {
      userList.push(doc.data());
    });
    return userList.length === 0;
  };

  const createChat = async () => {
    setLoadingCreateChat(true);
    const userDoesNotExists = await checkUserDoesNotExist();
    const chatExists = checkChatExists();
    if (userDoesNotExists) {
      setEmail("");
      toast({
        title: "User not found",
        description: `User with ${inputUsername} is not available`,
        status: "error",
        isClosable: true,
        duration: 10000,
      });
    } else if (chatExists) {
      setEmail("");
      toast({
        title: "Chat exists",
        description: `Chat with ${inputUsername} already exists`,
        status: "error",
        isClosable: true,
        duration: 10000,
      });
    } else {
      chatCollection()
        .add({ users: [username, inputUsername] })
        .then();
    }
    setLoadingCreateChat(false);
  };

  return (
    <>
      <Stack
        className={"sidebar"}
        display={"flex"}
        flexDirection={"column"}
        spacing={5}
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
                <MenuGroup title="Profile">
                  <MenuItem>My Account</MenuItem>
                  <MenuItem>Preferences </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup>
                  <MenuItem>Settings</MenuItem>
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
          {chatSnapshot?.docs.map((chat) => (
            <Contact
              key={chat.id}
              chat={chat}
              id={chat.id}
              username={username}
            />
          ))}
        </Stack>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start chat </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={inputUsername}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email Address"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={createChat}
              disabled={!inputUsername || inputUsername === username}
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
