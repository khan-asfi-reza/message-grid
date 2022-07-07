import { Box, Center, Spinner, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import LogoWithText from "@images/LogoText.png";

/**
 * Screen loader while authentication details loading
 * @component
 */
export const Loader = () => {
  return (
    <Center minH={"100vh"} width={"100%"} bg={"#f7f7f7"} borderRadius={"10px"}>
      <Stack spacing={4} padding={"2rem 3rem"} bg={"white"}>
        <Center>
          <Box position={"relative"} height={"100px"} width={"200px"}>
            <Image
              alt={"Logo"}
              layout={"fill"}
              objectFit={"contain"}
              src={LogoWithText}
            />
          </Box>
        </Center>
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
        <Text
          color={"blue.900"}
          fontWeight={"semibold"}
          fontSize={"xl"}
          textAlign={"center"}
        >
          Just a few moments, we are almost there
        </Text>
      </Stack>
    </Center>
  );
};
