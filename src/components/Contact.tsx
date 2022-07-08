import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import { getRecipientUsername, getSnapshotData } from "../utils";
import { useCollection } from "react-firebase-hooks/firestore";
import { chatCollection, userCollection } from "@db/collections";
import { useRouter } from "next/router";

// Prop type
interface ContactProps {
  chat: {
    users: Array<string>;
    updated: Date;
    id: string;
  };
  username: string;
  id: string;
}

export default function Contact({ chat, username, id }: ContactProps) {
  // Recipient Username, The partner's username
  // Here `chat` is an object contains a list of users, where
  // participants are in the current chat
  const recipientUsername = getRecipientUsername(chat.users, username);
  // User Collection where username is Recipient Username
  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.users, username)
  );
  // Recipient snapshot
  // Contains Recipient Data {online, photoURL, lastSeen, username}
  const [recipientSnapshot] = useCollection(userCollectionRef as any);

  // Message state snapshot
  const [messageStateSnapshot] = useCollection(
    chatCollection()
      .doc(id)
      .collection("messageState")
      .where("user", "==", username) as any
  );

  const router = useRouter();

  // Route push to chat inbox
  const onClickContact = async () => {
    await router.push(`/chat/${id}`);
  };

  // Number of unread messages
  const unreadMsg = () =>
    getSnapshotData(messageStateSnapshot, "unread") &&
    getSnapshotData(messageStateSnapshot, "unread") > 0
      ? getSnapshotData(messageStateSnapshot, "unread") > 99
        ? "99+"
        : getSnapshotData(messageStateSnapshot, "unread")
      : "";

  // This is a function which was created
  // Just to increase the size of the frontend element
  // If unread message number is one-digit number, the size can be
  // Small, so for that case use `first`
  // If unread message number is two-digit number then the size can be
  // slightly bigger so for that case use `second`
  // For 3+ Digit use third
  const unreadMsgSizeIncrease = (first, second, third) =>
    getSnapshotData(messageStateSnapshot, "unread") &&
    getSnapshotData(messageStateSnapshot, "unread") > 0
      ? first
      : getSnapshotData(messageStateSnapshot, "unread") > 10
      ? second
      : third;

  // Unread message Height and Width Size
  // As the HTML element will be round
  // Both height and width has to be same
  // So A function to define the size
  const unreadSize = () => unreadMsgSizeIncrease("15px", "17px", "19px");

  return (
    <Flex
      onClick={onClickContact}
      alignItems={"center"}
      gap={"1rem"}
      key={chat.id}
      cursor={"pointer"}
    >
      <Box position={"relative"}>
        <Avatar
          name={recipientUsername}
          src={getSnapshotData(recipientSnapshot, "photoURL")}
        />
        {getSnapshotData(messageStateSnapshot, "unread") > 0 && (
          <Center
            zIndex={"15"}
            position={"absolute"}
            height={unreadSize()}
            width={unreadSize()}
            padding={unreadMsgSizeIncrease("10px", "11px", "12px")}
            rounded={"full"}
            top={"-5px"}
            right={"-5px"}
            bg={"red.400"}
            color={"white"}
          >
            <Text fontSize={unreadMsgSizeIncrease("xs", "x-small", "x-small")}>
              {unreadMsg()}
            </Text>
          </Center>
        )}
        <Box
          position={"absolute"}
          bottom={0}
          height={"10px"}
          right={0}
          rounded={"full"}
          width={"10px"}
          background={
            getSnapshotData(recipientSnapshot, "online")
              ? "green.400"
              : "gray.400"
          }
        />
      </Box>
      <Box width={"full"}>
        <Flex
          width={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Flex alignItems={"center"} gap={"10px"}>
            <Text wordBreak={"break-word"} fontWeight={"medium"}>
              {recipientUsername}
            </Text>
          </Flex>
          {!getSnapshotData(messageStateSnapshot, "seen") && (
            <Box
              height={"10px"}
              width={"10px"}
              bg={"blue.500"}
              rounded={"full"}
            />
          )}
        </Flex>
        <Text>
          {getSnapshotData(recipientSnapshot, "online") ? "Online" : "Offline"}
        </Text>
      </Box>
    </Flex>
  );
}
