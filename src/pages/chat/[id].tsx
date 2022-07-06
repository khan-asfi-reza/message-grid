import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@component/Sidebar";
import { RouteAuthProtect } from "@layout/RouteGuard";
import { chatCollection } from "@db/collections";
import Seo from "@component/SEO";
import { getRecipientUsername } from "../../utils";
import { useUserDetails } from "../../context/AuthContext";
import { ChatScreen } from "@component/ChatScreen";
import Router from "next/router";

export default function Chat({ chat, messages }) {
  const { user } = useUserDetails();
  return (
    <RouteAuthProtect>
      <Seo title={`Message Grid | ${getRecipientUsername(chat.users, user)}`} />
      <Flex>
        <Sidebar />
        <ChatScreen chat={chat} messages={messages} />
      </Flex>
    </RouteAuthProtect>
  );
}

export async function getServerSideProps(context) {
  let ref;
  try {
    ref = chatCollection().doc(context.query.id);
  } catch (e) {
    await Router.push("/");
  }

  const messageRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messageRes.docs
    .map((doc) => ({
      id: doc.id,
      timestamp: doc.data().timestamp,
      ...doc.data(),
    }))
    .map((message) => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime(),
    }));
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
