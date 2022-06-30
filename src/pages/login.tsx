import Seo from "@component/SEO";
import NextLink from "next/link";
import { Flex, Link } from "@chakra-ui/react";
import useFirebaseAuth from "@hooks/useFirebaseAuth";

import React from "react";
import Authentication from "@component/Authentication";

export default function Login() {
  const {
    signInWithGoogle,
    signInWithGithub,
    signInWithEmailAndPassword,
    loading,
  } = useFirebaseAuth();

  return (
    <>
      <Seo title={"Login | Message Grid"} />
      <Authentication
        title={"Login"}
        loading={loading}
        signInWithGoogle={signInWithGoogle}
        signInWithGithub={signInWithGithub}
        signInWithEmail={signInWithEmailAndPassword}
      >
        <Flex direction={"row-reverse"} justifyContent={"space-between"}>
          <NextLink href="/signup" passHref>
            <Link color={"gray.600"} fontSize={"sm"}>
              Have an account?
            </Link>
          </NextLink>
        </Flex>
      </Authentication>
    </>
  );
}
