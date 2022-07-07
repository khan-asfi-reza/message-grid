import { Box, Button, Center, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

/**
 * Login/Signup Button
 * @param {React.MouseEvent<HTMLButtonElement>} onClick
 * @param {string} bg
 * @param {string} logoBg
 * @param {JSX.Element | string } icon
 * @param {Object} hover
 * @param {string} text
 * @param {boolean} isLoading
 * @component
 */
export function LoginButton({
  onClick,
  bg,
  logoBg,
  icon,
  hover,
  text,
  isLoading,
}) {
  return (
    <Button
      alignItems={"center"}
      px={"0.1rem"}
      bg={bg}
      display={"flex"}
      width={"15rem"}
      isLoading={isLoading}
      onClick={onClick}
      color={"white"}
      _hover={hover}
    >
      <Center height={"90%"} bg={logoBg} px={"10px"} borderRadius={"5px"}>
        <Box height={"15px"} boxSizing={"border-box"} width={"15px"}>
          <Image alt={"Image"} width={15} height={15} src={icon} />
        </Box>
      </Center>
      <Box flex={"1"}>
        <Text variant={"p"} fontWeight={"500"} color={"gray.100"}>
          {text}
        </Text>
      </Box>
    </Button>
  );
}
