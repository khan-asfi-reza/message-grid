import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { getRecipientUsername } from "../utils";
import { useCollection } from "react-firebase-hooks/firestore";
import { chatCollection, userCollection } from "@db/collections";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Contact({ chat, username, id }) {
  const recipientUsername = getRecipientUsername(chat.users, username);
  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.users, username)
  );
  const [recipientSnapshot] = useCollection(userCollectionRef as any);

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
