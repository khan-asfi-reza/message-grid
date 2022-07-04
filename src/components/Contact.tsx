import { Avatar, Flex, Text } from "@chakra-ui/react";
import { getRecipientUsername } from "../utils";
import { useCollection } from "react-firebase-hooks/firestore";
import { userCollection } from "@db/collections";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Contact({ chat, username, id }) {
  const recipientUsername = getRecipientUsername(chat.data().users, username);
  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.data().users, username)
  );
  const [recipientSnapshot] = useCollection(userCollectionRef as any);

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
        src={recipientSnapshot?.docs[0].data().photoURL}
      />
      <Text wordBreak={"break-word"} fontWeight={"medium"}>
        {recipientUsername}
      </Text>
    </Flex>
  );
}
