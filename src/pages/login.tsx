import Seo from "@component/SEO";
import NextLink from "next/link";
import { Flex, Link } from "@chakra-ui/react";

import React from "react";
import Authentication from "@component/Authentication";
import { useAuth } from "../context/AuthContext";
import { RouteUnAuthProtect } from "@layout/RouteGuard";

export default function Login() {
  const {
    signInWithGoogle,
    signInWithGithub,
    signInWithEmailAndPassword,
    loading,
  } = useAuth();

  return (
    <RouteUnAuthProtect>
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
              Don't Have an account?
            </Link>
          </NextLink>
        </Flex>
      </Authentication>
    </RouteUnAuthProtect>
  );
}
