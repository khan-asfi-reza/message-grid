import Seo from "@component/SEO";
import NextLink from "next/link";
import { Flex, Link } from "@chakra-ui/react";

import React from "react";
import Authentication from "@component/Authentication";
import { useAuth } from "../context/AuthContext";
import { RouteUnAuthProtect } from "@layout/RouteGuard";

export default function Signup() {
  const {
    signInWithGoogle,
    signInWithGithub,
    createUserWithEmailAndPassword,
    loading,
  } = useAuth();

  return (
    <RouteUnAuthProtect>
      <Seo title={"Signup | Message Grid"} />
      <Authentication
        title={"Signup"}
        loading={loading}
        signInWithGoogle={signInWithGoogle}
        signInWithGithub={signInWithGithub}
        signInWithEmail={createUserWithEmailAndPassword}
      >
        <Flex direction={"row-reverse"} justifyContent={"space-between"}>
          <NextLink href="/login" passHref>
            <Link color={"gray.600"} fontSize={"sm"}>
              Have an account?
            </Link>
          </NextLink>
        </Flex>
      </Authentication>
    </RouteUnAuthProtect>
  );
}
