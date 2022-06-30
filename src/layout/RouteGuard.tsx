import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { Center, Spinner, Stack, Text, Box } from "@chakra-ui/react";
import LogoWithText from "@images/LogoText.png";
import Image from "next/image";
const RouteProtect = ({ children }) => {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) router.push("/login").then((r) => {});
  }, [authUser, loading, router]);

  if (loading || !authUser) {
    return (
      <Center
        minH={"100vh"}
        width={"100%"}
        bg={"#f7f7f7"}
        borderRadius={"10px"}
      >
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
  }
  return <>{children}</>;
};

export default RouteProtect;
