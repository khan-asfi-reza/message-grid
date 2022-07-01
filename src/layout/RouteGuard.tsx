import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { Loader } from "@component/Loader";

export const RouteUnAuthProtect = ({ children }) => {
  const { authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      router.push("/").then().catch();
    }
  }, [authUser, router]);

  if (!authUser) return <>{children}</>;
};
export const RouteAuthProtect = ({ children }) => {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading.authLoading && !authUser) router.push("/login").then();
  }, [authUser, loading.authLoading, router]);

  if (loading.authLoading || !authUser) {
    return <Loader />;
  }
  return <>{children}</>;
};
