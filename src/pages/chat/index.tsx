import Sidebar from "@component/Sidebar";
import { RouteAuthProtect } from "@layout/RouteGuard";
import Seo from "@component/SEO";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function Chat() {
  return (
    <RouteAuthProtect>
      <RouteAuthProtect>
        <Seo title={`Message Grid`} />
        <Flex>
          <Sidebar />
          <Box
            bg={"gray.100"}
            className={"custom-scroll"}
            flex={1}
            height={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            overflowY={"auto"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text fontSize={"lg"} color={"gray.900"} fontWeight={"medium"}>
              Select or start a conversation
            </Text>
          </Box>
        </Flex>
      </RouteAuthProtect>
    </RouteAuthProtect>
  );
}
