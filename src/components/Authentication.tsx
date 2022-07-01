import Image from "next/image";
import Seo from "@component/SEO";
import LogoWithText from "@images/LogoText.png";
import GoogleIcon from "@images/google.png";
import GithubIcon from "@images/github.png";
import Static from "@images/staticbg.png";
import { validate as validateEmail } from "email-validator";
import { AnimatePresence, motion } from "framer-motion";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoEye, IoEyeOff, IoLockClosed, IoMail } from "react-icons/io5";

import React, { useState } from "react";
import { LoginButton } from "@component/Buttons";
import { loadingState } from "../context/AuthContext";

interface AuthenticationProps {
  title: string;
  signInWithGoogle: Function;
  signInWithGithub: Function;
  signInWithEmail: Function;
  loading: loadingState;
  children?: JSX.Element;
}

const Authentication: React.FC<AuthenticationProps> = ({
  title,
  signInWithGoogle,
  signInWithGithub,
  signInWithEmail,
  loading,
  children,
}) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const handleInput = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleAuthentication = () => {
    setError("");
    signInWithEmail(user.email, user.password).catch(() => {
      setError(`Failed to process your action, ${title} failed`);
    });
  };

  const handleAppAuthentication = (callback, app) => {
    setError("");
    callback().catch(() => {
      setError(`Failed to ${title} with ${app}`);
    });
  };

  return (
    <>
      <Seo title={`${title} | Message Grid`} />
      <Center
        width={"100%"}
        minH={"100vh"}
        bg={"#f7f7f7"}
        position={"relative"}
      >
        <Box
          position={"absolute"}
          height={"100%"}
          width={"100%"}
          top={0}
          left={0}
        >
          <Image
            alt={"Static Image"}
            src={Static}
            layout={"fill"}
            objectFit={"contain"}
            objectPosition={"center"}
          />
        </Box>
        <AnimatePresence exitBeforeEnter={true}>
          <Grid
            as={motion.div}
            minW={"525px"}
            borderRadius={"5px"}
            gap={"1.5rem"}
            boxShadow={"md"}
            key={"auth"}
            initial={{ x: -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 1000, opacity: 0 }}
            padding={"3rem 4rem"}
            placeItems={"center"}
            bg={"white"}
          >
            <Image
              alt={"Image"}
              width={250}
              height={96.9713}
              src={LogoWithText}
            />
            <Stack textAlign={"center"}>
              <Text
                variant={"p"}
                color={"gray.700"}
                fontWeight={"600"}
                fontSize={"2xl"}
              >
                {title}
              </Text>
              <Text variant={"p"} color={"gray.500"} fontSize={"lg"}>
                Welcome to Message Grid
              </Text>
            </Stack>
            <Stack width={"100%"} spacing={4}>
              <AnimatePresence exitBeforeEnter>
                {error && (
                  <Alert
                    as={motion.div}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    status="error"
                  >
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </AnimatePresence>
              <InputGroup width={"100%"}>
                <InputLeftElement>
                  <IoMail />
                </InputLeftElement>
                <Input
                  variant="filled"
                  type={"text"}
                  name={"email"}
                  isInvalid={user.email && !validateEmail(user.email)}
                  onChange={handleInput}
                  placeholder={"Email"}
                />
              </InputGroup>
              <InputGroup width={"100%"}>
                <InputLeftElement>
                  <IoLockClosed />
                </InputLeftElement>
                <Input
                  variant="filled"
                  name={"password"}
                  onChange={handleInput}
                  type={show ? "text" : "password"}
                  placeholder={"Password"}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="md" onClick={handleClick}>
                    {show ? <IoEye /> : <IoEyeOff />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {children}
            </Stack>

            <Stack spacing={4}>
              <Button
                alignItems={"center"}
                px={"0.1rem"}
                bg={"blue.300"}
                width={"15rem"}
                colorScheme={"blue"}
                isLoading={loading.emailLoading}
                onClick={handleAuthentication}
                disabled={
                  !user.email || !user.password || !validateEmail(user.email)
                }
                color={"white"}
                _hover={{ bg: "blue.600" }}
              >
                {title}
              </Button>
              <Text
                textAlign={"center"}
                fontWeight={"semibold"}
                fontSize={"md"}
              >
                Or
              </Text>
              <LoginButton
                bg={"blue.500"}
                onClick={() => {
                  handleAppAuthentication(signInWithGoogle, "Google");
                }}
                icon={GoogleIcon}
                isLoading={loading.googleLoading}
                logoBg={"white"}
                hover={{ bg: "blue.600" }}
                text={"Login with Google"}
              />
              <LoginButton
                bg={"black"}
                onClick={() => {
                  handleAppAuthentication(signInWithGithub, "Github");
                }}
                icon={GithubIcon}
                isLoading={loading.githubLoading}
                logoBg={"white"}
                hover={{ bg: "gray.700" }}
                text={"Login with Github"}
              />
            </Stack>
          </Grid>
        </AnimatePresence>
      </Center>
    </>
  );
};

export default Authentication;
