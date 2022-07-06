import { Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { IoHappyOutline, IoPaperPlaneOutline } from "react-icons/io5";
import { memo, useState } from "react";
import { chatCollection } from "@db/collections";
import { getQueryId } from "../utils";
import firebase from "firebase/compat/app";

const ChatSend = ({ router, username, user, callback }) => {
  const [input, setInput] = useState("");

  const sendButtonClick = async (e) => {
    e.preventDefault();
    await chatCollection()
      .doc(getQueryId(router))
      .collection("messages")
      .doc()
      .set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: username,
        photoURL: user.photoURL,
      });
    await callback;
    setInput("");
  };

  return (
    <Flex
      as={"form"}
      display={"flex"}
      bg={"#f7f7f7"}
      zIndex={10}
      justifyContent={"space-between"}
      position={"sticky"}
      bottom={0}
      gap={"10px"}
      padding={"1rem 1.5rem"}
    >
      <IconButton bg={"transparent"} aria-label={"Emoji Icon"}>
        <IoHappyOutline />
      </IconButton>
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder={"Type here.."}
        flex={1}
      />
      <Button
        onClick={sendButtonClick}
        disabled={input === ""}
        type={"submit"}
        bg={"transparent"}
      >
        <IoPaperPlaneOutline />
      </Button>
    </Flex>
  );
};

export default ChatSend;