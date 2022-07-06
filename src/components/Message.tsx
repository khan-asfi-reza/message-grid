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
import { IoEllipsisVertical, IoRepeatOutline } from "react-icons/io5";
import { chatCollection } from "@db/collections";

const getTimeDifference = (from, to) => new Date(from - to).getSeconds();

export default function Message({
  user,
  messages,
  authUser,
  messageList,
  index,
  chatId,
  id,
}) {
  const isSelfOrPartner = () => user === authUser;

  const isMessageSending = () => !!!messages.timestamp;

  const isNextUserSelf = () =>
    index < messageList.length - 1 && messageList[index + 1].user === user;

  const valueIfUserIsSelf = (selfValue, partnerValue) =>
    isSelfOrPartner() ? selfValue : partnerValue;

  const valueIfNextUserIsSelf = (selfValue, partnerValue) =>
    isNextUserSelf() ? selfValue : partnerValue;

  const valueIfPreviousUserIsSelf = (selfValue, partnerValue) =>
    index > 0 && messageList[index - 1].user === user
      ? selfValue
      : partnerValue;

  const valueIfPrevIsSelfAndTime = (trueVal, defaultVal) =>
    valueIfPreviousUserIsSelf(true, false) &&
    (isMessageSending() ||
      getTimeDifference(
        messages.timestamp,
        messageList[index - 1].messages.timestamp
      ) < 1800)
      ? trueVal
      : defaultVal;

  const deleteMessage = async () => {
    if (user === authUser) {
      await chatCollection()
        .doc(chatId)
        .collection("messages")
        .doc(id)
        .delete();
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
      <Flex gap={"8px"} direction={"column"}>
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
        <Flex role={"group"} gap={"12px"}>
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
            <MenuList>
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
        </Flex>
      </Flex>
    </Flex>
  );
}