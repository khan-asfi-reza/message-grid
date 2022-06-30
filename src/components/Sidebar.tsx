import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Stack,
  Box,
  InputLeftElement,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
  IoChatboxEllipsesOutline,
  IoEllipsisVerticalOutline,
  IoSearchOutline,
} from "react-icons/io5";

// Sidebar header | Top head content
const Header = styled(Flex)`
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2.5rem;
  border-bottom: 1px solid #f7f7f7;
`;

export default function Sidebar() {
  const createChat = (): void => {};
  return (
    <Box>
      <Header>
        <Avatar
          cursor={"pointer"}
          transition={"all 0.25s"}
          _hover={{ opacity: 0.7 }}
        />
        <Flex gap={"1rem"}>
          <IconButton aria-label={"Chat"}>
            <IoChatboxEllipsesOutline />
          </IconButton>
          <Menu>
            <MenuButton as={Button}>
              <IoEllipsisVerticalOutline />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem>My Account</MenuItem>
                <MenuItem>Payments </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Help">
                <MenuItem>Docs</MenuItem>
                <MenuItem>FAQ</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      </Header>
      <Stack spacing={5}>
        <InputGroup size={"md"}>
          <InputLeftElement bg={"transparent"} pointerEvents="none">
            <IoSearchOutline color={"gray.300"} />
          </InputLeftElement>
          <Input placeholder={"Search"} />
        </InputGroup>
        <Button onClick={createChat}>New Chat +</Button>
      </Stack>
    </Box>
  );
}
