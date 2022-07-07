import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import {
  IoEllipsisVertical,
  IoRepeatOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { chatCollection } from "@db/collections";
import { useRef } from "react";

const getTimeDifference = (from: number, to: number): number =>
  new Date(from - to).getSeconds();

interface MessageInterface {
  user: string;
  messages: { [p: string]: any; timestamp: number };
  authUser: string;
  messageList: Array<any>;
  index: number;
  chatId: string;
  id: string;
}

/**
 *
 * @param {string} user Message user. Message sent by user
 * @param {Object} messages Messages Object, {message: string, timestamp: Date, photoURL: string}
 * @param {string} authUser Auth username
 * @param {Array} messageList List of messages
 * @param {number} index Index of message
 * @param {string} chatId Chat ID
 * @param {string} id Message ID
 * @component
 */
export default function Message({
  user,
  messages,
  authUser,
  messageList,
  index,
  chatId,
  id,
}: MessageInterface) {
  // If message is sending or sent
  const isMessageSending = () => !!!messages.timestamp;

  // If next message is sent from authenticated user
  const isNextUserSelf = () =>
    index < messageList.length - 1 && messageList[index + 1].user === user;

  // If next message is sent from authenticated user
  // then return self value else return partnerValue
  const valueIfNextUserIsSelf = (selfValue, partnerValue) =>
    isNextUserSelf() ? selfValue : partnerValue;

  // If previous message is sent from authenticated user
  // then return self value else return partnerValue
  const valueIfPreviousUserIsSelf = (selfValue, partnerValue) =>
    index > 0 && messageList[index - 1].user === user
      ? selfValue
      : partnerValue;

  // IF previous message is sent from authenticated user and
  // Time between two message is between 30 minutes, then
  // return trueVal else return defaultVal
  const valueIfPrevIsSelfAndTime = (trueVal, defaultVal) =>
    valueIfPreviousUserIsSelf(true, false) &&
    (isMessageSending() ||
      getTimeDifference(
        messages.timestamp,
        messageList[index - 1].messages.timestamp
      ) < 1800)
      ? trueVal
      : defaultVal;

  // Delete message only if the message
  // is sent from the authenticated user
  const deleteMessage = async () => {
    if (user === authUser) {
      await chatCollection()
        .doc(chatId)
        .collection("messages")
        .doc(id)
        .delete();
    }
  };

  // Delete Component Ref
  const deleteRef = useRef(null);

  // If mouse over and with shift key then make delete key visible
  const onMouseOver = (event) => {
    if (event.shiftKey) {
      if (deleteRef.current) {
        deleteRef.current.style.visibility = "visible";
      }
    }
  };

  // If mouse leaves then make it hidden
  const onMouseLeave = () => {
    if (deleteRef.current) {
      deleteRef.current.style.visibility = "hidden";
    }
  };

  return (
    <Flex
      paddingBottom={valueIfNextUserIsSelf("5px", "20px")}
      gap={"10px"}
      width={"100%"}
    >
      <Flex gap={"5px"}>
        {
          <Avatar
            visibility={valueIfPrevIsSelfAndTime("hidden", "visible")}
            src={messages.photoURL}
            name={user}
          />
        }
      </Flex>
      <Flex width={"100%"} gap={"8px"} direction={"column"}>
        <Flex gap={"10px"} alignItems={"center"}>
          <Text
            fontWeight={"medium"}
            display={valueIfPrevIsSelfAndTime("none", "block")}
            fontSize={""}
            color={"gray.700"}
          >
            {user}
          </Text>
          <Text fontSize={"x-small"}>
            {valueIfPrevIsSelfAndTime(
              "",
              moment(messages.timestamp).calendar()
            )}
          </Text>
        </Flex>
        <Flex
          width={"100%"}
          onMouseOver={onMouseOver}
          onMouseUp={onMouseOver}
          onMouseDown={onMouseOver}
          onMouseUpCapture={onMouseOver}
          onMouseLeave={onMouseLeave}
          onMouseOut={onMouseLeave}
          role={"group"}
          gap={"12px"}
        >
          <Tooltip label={moment(messages.timestamp).calendar()}>
            <Box
              color={isMessageSending() && "gray.300"}
              rounded={"md"}
              padding={"1rem 1.2rem"}
              bg={"#d2effc"}
            >
              {messages.message}
            </Box>
          </Tooltip>
          <Menu>
            <Tooltip label={"More"}>
              <MenuButton
                display={"grid"}
                placeItems={"center"}
                visibility={"hidden"}
                color={"gray.500"}
                aria-label={"More"}
                bg={"transparent"}
                _groupHover={{ visibility: "visible" }}
                as={IconButton}
              >
                <IoEllipsisVertical />
              </MenuButton>
            </Tooltip>
            <MenuList zIndex={100}>
              <MenuItem>Reply</MenuItem>
              {user === authUser && (
                <MenuItem onClick={deleteMessage}>Delete</MenuItem>
              )}
            </MenuList>
          </Menu>

          <Tooltip label={"Reply"}>
            <IconButton
              visibility={"hidden"}
              _groupHover={{ visibility: "visible" }}
              bg={"transparent"}
              color={"gray.500"}
              aria-label={"Reply"}
            >
              <IoRepeatOutline />
            </IconButton>
          </Tooltip>
          {user === authUser && (
            <Tooltip label={"Delete"}>
              <IconButton
                onClick={deleteMessage}
                visibility={"hidden"}
                ref={deleteRef}
                bg={"transparent"}
                color={"gray.500"}
                aria-label={"Reply"}
                _hover={{ color: "red.500" }}
              >
                <IoTrashBinOutline />
              </IconButton>
            </Tooltip>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
