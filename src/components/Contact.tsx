import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { getRecipientUsername } from "../utils";
import { useCollection } from "react-firebase-hooks/firestore";
import { chatCollection, userCollection } from "@db/collections";
import { useRouter } from "next/router";

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
  // Recipient Username
  const recipientUsername = getRecipientUsername(chat.users, username);
  // User Collection where username is Recipient Username
  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.users, username)
  );
  // Recipient snapshot
  const [recipientSnapshot] = useCollection(userCollectionRef as any);

  // Message state snapshot
  const [messageStateSnapshot] = useCollection(
    chatCollection()
      .doc(id)
      .collection("messageState")
      .doc(getRecipientUsername(chat.users, username)) as any
  );

  const router = useRouter();

  const onClickContact = async () => {
    await router.push(`/chat/${id}`);
  };

  return (
    <Flex
      onClick={onClickContact}
      alignItems={"center"}
      gap={"1rem"}
      key={chat.id}
      cursor={"pointer"}
    >
      <Avatar
        name={recipientUsername}
        src={recipientSnapshot?.docs[0]?.data().photoURL}
      />
      <Box>
        <Text wordBreak={"break-word"} fontWeight={"medium"}>
          {recipientUsername}
        </Text>
        <Text>{messageStateSnapshot?.docs.at(0).data().unread}</Text>
      </Box>
    </Flex>
  );
}
