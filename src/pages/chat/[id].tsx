import { Flex } from "@chakra-ui/react";
import Sidebar from "@component/Sidebar";
import { RouteAuthProtect } from "@layout/RouteGuard";
import { chatCollection } from "@db/collections";
import Seo from "@component/SEO";
import { getRecipientUsername } from "../../utils";
import { useUserDetails } from "../../context/AuthContext";
import { ChatScreen } from "@component/ChatScreen";
import Router from "next/router";

export default function Chat({ chat }) {
  const { user } = useUserDetails();
  return (
    <RouteAuthProtect>
      <Seo title={`Message Grid | ${getRecipientUsername(chat.users, user)}`} />
      <Flex>
        <Sidebar />
        <ChatScreen chat={chat} />
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

  const chatRes = await ref.get();

  const chat = {
    id: chatRes.id,
    users: chatRes.data().users,
  };

  return {
    props: {
      chat: chat,
    },
  };
}
