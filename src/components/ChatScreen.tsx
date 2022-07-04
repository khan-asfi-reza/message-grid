import { Avatar, Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { IoEllipsisVertical } from "react-icons/io5";
import { useUserDetails } from "../context/AuthContext";
import { getRecipientUsername } from "../utils";
import { userCollection } from "@db/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";

export const ChatScreen = ({ chat, messages }) => {
  const { user, username } = useUserDetails();
  const recipientUsername = getRecipientUsername(chat.users, username);
  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.users, username)
  );
  const [recipientSnapshot] = useCollection(userCollectionRef as any);

  return (
    <Box bg={"gray.100"} flex={1} height={"100vh"} overflowY={"auto"}>
      <Flex
        position={"sticky"}
        top={0}
        bg={"#f7f7f7"}
        py={"1rem"}
        px={"2rem"}
        justifyContent={"space-between"}
      >
        <Flex alignItems={"center"} gap={"10px"}>
          <Avatar
            name={recipientUsername}
            src={recipientSnapshot?.docs[0].data().photoURL}
          />
          <Flex direction={"column"}>
            <Flex direction={"row"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"medium"} color={"gray.800"}>
                {recipientUsername}
              </Text>
              {recipientSnapshot?.docs[0].data().online ? (
                <Box
                  h={"10px"}
                  w={"10px"}
                  rounded={"full"}
                  bg={"green.500"}
                ></Box>
              ) : (
                <Box
                  h={"10px"}
                  w={"10px"}
                  rounded={"full"}
                  bg={"gray.500"}
                ></Box>
              )}
            </Flex>
            {recipientSnapshot?.docs[0].data().online ? (
              <Text fontSize={"md"} color={"gray.600"}>
                Online
              </Text>
            ) : (
              <Text fontSize={"md"} color={"gray.600"}>
                Last seen{" "}
                {recipientSnapshot?.docs[0].data().lastSeen
                  ? moment(
                      recipientSnapshot?.docs[0]
                        .data()
                        .lastSeen?.toDate()
                        .toDateString()
                    ).calendar()
                  : ""}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={"10px"}>
          <IconButton bg={"transparent"} aria-label={"More"}>
            <IoEllipsisVertical />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  );
};
