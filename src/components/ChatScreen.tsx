import { Avatar, Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { IoEllipsisVertical } from "react-icons/io5";
import { useUserDetails } from "../context/AuthContext";
import { getQueryId, getRecipientUsername } from "../utils";
import { chatCollection, userCollection } from "@db/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import Message from "./Message";
import { useCallback, useEffect, useRef } from "react";
import ChatSend from "@component/ChatSend";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const ChatScreen = ({ chat }) => {
  const { username, user } = useUserDetails();
  const recipientUsername = getRecipientUsername(chat.users, username);
  const router = useRouter();
  const endViewRef = useRef(null);
  const scrollViewRef = useRef(null);

  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.users, username)
  );

  const [recipientSnapshot] = useCollection(userCollectionRef as any);

  const messageRef = chatCollection()
    .doc(getQueryId(router))
    .collection("messages")
    .orderBy("timestamp", "asc");

  const [messageSnapshot] = useCollection(messageRef as any);

  const messageList = useCallback(() => {
    if (messageSnapshot) {
      return [
        ...messageSnapshot.docs.map((message) => ({
          id: message.id,
          user: message.data().user,
          authUser: username,
          messages: {
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          },
        })),
      ];
    } else {
      return [];
    }
  }, [messageSnapshot, username]);

  const prevLength = usePrevious(messageList().length);

  useEffect(() => {
    const length = prevLength === null ? 0 : prevLength;
    const list = messageList();
    if (prevLength === 0 && list.length > length) {
      endViewRef.current?.scrollIntoView();
    }

    if (list) {
      if (
        list.at(-1) &&
        list.at(-1).user === username &&
        length < list.length
      ) {
        endViewRef.current?.scrollIntoView();
      } else {
        try {
          if (isInViewport(scrollViewRef.current?.children[list.length - 2])) {
            endViewRef.current?.scrollIntoView();
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [messageList, prevLength, username]);

  const getMessageSnapshotDocs = async () => {
    return chatCollection()
      .doc(getQueryId(router))
      .collection("messageState")
      .doc(recipientSnapshot?.docs[0].data().username);
  };

  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    if (messageList()) {
      if (username) {
        chatCollection()
          .doc(getQueryId(router))
          .collection("messageState")
          .doc(username)
          .set(
            {
              seen: true,
              delivered: true,
              unread: 0,
            },
            { merge: true }
          )
          .then();
      }
    }
  }, [messageList, router, username]);

  const setDeliveryState = async () => {
    const messageStateDoc = await getMessageSnapshotDocs();
    const getState = await messageStateDoc.get();
    await messageStateDoc.set(
      {
        seen: false,
        delivered: recipientSnapshot?.docs[0].data().online,
        unread: getState.data()?.unread ? getState.data()?.unread + 1 : 1,
      },
      { merge: true }
    );
  };

  return (
    <Box
      bg={"gray.100"}
      className={"custom-scroll"}
      flex={1}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      overflowY={"auto"}
    >
      <Flex
        position={"sticky"}
        top={0}
        zIndex={"10"}
        bg={"#f7f7f7"}
        py={"1rem"}
        px={"2rem"}
        justifyContent={"space-between"}
      >
        <Flex alignItems={"center"} gap={"10px"}>
          <Avatar
            name={recipientUsername}
            src={recipientSnapshot?.docs[0]?.data().photoURL}
          />
          <Flex direction={"column"}>
            <Flex direction={"row"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"medium"} color={"gray.800"}>
                {recipientUsername}
              </Text>
              {recipientSnapshot?.docs[0]?.data().online ? (
                <Box h={"10px"} w={"10px"} rounded={"full"} bg={"green.500"} />
              ) : (
                <Box h={"10px"} w={"10px"} rounded={"full"} bg={"gray.500"} />
              )}
            </Flex>
            {recipientSnapshot?.docs[0]?.data().online ? (
              <Text fontSize={"md"} color={"gray.600"}>
                Online
              </Text>
            ) : (
              <Text fontSize={"md"} color={"gray.600"}>
                Last seen{" "}
                {recipientSnapshot?.docs[0]?.data().lastSeen
                  ? moment(
                      recipientSnapshot?.docs[0]
                        ?.data()
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
      {/*Chat Messages Container*/}
      <Box
        ref={scrollViewRef}
        id={"scrollComponent"}
        padding={"1rem 2rem"}
        flexDirection={"column"}
        height={"100vh"}
        overflowY={"auto"}
      >
        {messageList().map((message, index) => (
          <Message
            chatId={getQueryId(router)}
            id={message.id}
            key={message.id}
            messageList={messageList()}
            index={index}
            {...message}
          />
        ))}
        <Box ref={endViewRef} id={"endView"} />
      </Box>
      {/*Chat Send Component  */}
      <ChatSend
        user={user}
        username={username}
        router={router}
        callback={setDeliveryState}
      />
    </Box>
  );
};
