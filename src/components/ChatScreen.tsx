import {
  Avatar,
  Box,
  Flex,
  IconButton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { IoEllipsisVertical } from "react-icons/io5";
import { useUserDetails } from "../context/AuthContext";
import { getQueryId, getRecipientUsername, isInViewport } from "../utils";
import { chatCollection, userCollection } from "@db/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import Message from "./Message";
import { useCallback, useEffect, useRef } from "react";
import ChatSend from "@component/ChatSend";
import firebase from "firebase/compat/app";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface ChatScreenPropInterface {
  chat: {
    users: Array<string>;
    id: string;
  };
}

export const ChatScreen = ({ chat }: ChatScreenPropInterface) => {
  // Authenticated username and user details
  const { username, user } = useUserDetails();
  // Partner/Chat Partner username
  const recipientUsername = getRecipientUsername(chat.users, username);
  const router = useRouter();
  // To end of the message view ref
  const endViewRef = useRef(null);
  // Scroll List view ref
  const scrollViewRef = useRef(null);

  // User collection where user is partner user
  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.users, username)
  );

  // Get partner user Data from database
  const [recipientSnapshot] = useCollection(userCollectionRef as any);

  // Message Ref Chat Collection
  const messageRef = chatCollection()
    .doc(getQueryId(router))
    .collection("messages")
    .orderBy("timestamp", "asc");

  // All message snapshot from the current chat
  const [messageSnapshot, loading] = useCollection(messageRef as any);

  // List of messages parsed properly
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

  // Message previous length
  const prevLength = usePrevious(messageList().length);

  // Message state, read unread state
  const getMessageSnapshotDocs = useCallback(async () => {
    return chatCollection().doc(getQueryId(router)).collection("messageState");
  }, [router]);

  // Update Chat Timestamp
  const updateChatTimeStamp = async () => {
    await chatCollection()
      .doc(getQueryId(router))
      .update("updated", firebase.firestore.FieldValue.serverTimestamp());
  };

  // Set Delivery state, if message is sent by default
  // set seen false and increase number of unread
  const setDeliveryState = async () => {
    const messageStateDoc = await getMessageSnapshotDocs();
    const getState = await messageStateDoc
      .where("user", "==", recipientUsername)
      .get();
    let setter;
    let unreadStat;
    if (getState?.docs[0]) {
      setter = messageStateDoc.doc(getState?.docs[0].id);
      unreadStat = getState.docs[0].data()?.unread
        ? getState.docs[0].data()?.unread + 1
        : 1;
    } else {
      setter = messageStateDoc.doc();
      unreadStat = 1;
    }
    await setter.set(
      {
        user: recipientUsername,
        seen: false,
        delivered: recipientSnapshot?.docs[0].data().online,
        unread: unreadStat,
      },
      { merge: true }
    );
  };

  // Set Delivery Default, make seen true, delivered set to true
  const setDeliveryStateToDefault = useCallback(async () => {
    if (username) {
      const messageStateDoc = await getMessageSnapshotDocs();
      const getState = await messageStateDoc
        .where("user", "==", username)
        .get();
      let setter;
      if (getState?.docs[0]) {
        setter = messageStateDoc.doc(getState?.docs[0].id);
      } else {
        setter = messageStateDoc.doc();
      }
      await setter.set(
        {
          user: username,
          seen: true,
          delivered: true,
          unread: 0,
        },
        { merge: true }
      );
    }
  }, [getMessageSnapshotDocs, username]);

  // If initial load is complete then scroll to bottom
  // If auth user sends message then scroll to bottom
  // If it is already in the bottom, scroll to the new message
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
        } catch (e) {}
      }
    }

    setDeliveryStateToDefault().then();
  }, [messageList, prevLength, setDeliveryStateToDefault, username]);

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
                      recipientSnapshot?.docs[0]?.data().lastSeen?.toDate()
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
        {loading && (
          <>
            <Box display={"flex"} padding={"1rem 0"} gap={"10px"}>
              <SkeletonCircle size="12" />
              <SkeletonText flex={1} noOfLines={3} spacing="4" />
            </Box>
            <Box display={"flex"} padding={"1rem 0"} gap={"10px"}>
              <SkeletonCircle size="12" />
              <SkeletonText flex={1} noOfLines={3} spacing="4" />
            </Box>
          </>
        )}
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
        updateChat={updateChatTimeStamp}
        callback={setDeliveryState}
      />
    </Box>
  );
};
