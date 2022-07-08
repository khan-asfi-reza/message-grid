import "../styles/globals.css";
import "nprogress/nprogress.css";
import type { AppProps } from "next/app";
import { AuthUserProvider, UserDetailsContext } from "../context/AuthContext";
import Theme from "../layout/Theme";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase.conf";
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { userCollection } from "@db/collections";
import NProgress from "nprogress";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Router from "next/router";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  // User Auth State from Firebase
  const [user] = useAuthState(auth as any);
  // Chakra UI Modal hook, open, close function and if the modal is open
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Suppose user has no username
  // It will open a modal to store the user's username
  // This state stores user input
  const [username, setUsername] = useState("");
  // Load authenticated user's username
  const [authUsername, setAuthUsername] = useState("");
  // Loading State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if username exists
  const checkUsernameExists = useCallback(async (_name) => {
    const userCollectionRef = await userCollection()
      .where("username", "==", _name)
      .get();
    return userCollectionRef?.docs.length > 0;
  }, []);

  // Handle username input
  const handleInput = (e) => {
    checkUsernameExists(e.target.value).then((exists) => {
      if (exists) {
        setError("Username taken");
      } else {
        setError("");
      }
    });
    setUsername(e.target.value);
  };

  // Get username of the authenticated user
  const getUserName = useCallback(async () => {
    if (user) {
      const userCollectionRef = await userCollection()
        .where("email", "==", user.email)
        .get();
      return userCollectionRef?.docs[0]?.data();
    }
  }, [user]);

  // Save user data,
  // Save user's username and
  // Save LastSeen and PhotoURL
  const saveUserData = useCallback(
    (username, callback = () => {}) => {
      if (user) {
        userCollection()
          .doc(user.uid)
          .set(
            {
              username: username,
              email: user.email,
              lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
              photoURL: user.photoURL,
              online: true,
            },
            { merge: true }
          )
          .then(callback)
          .catch();
      }
    },
    [user]
  );

  // Set offline status when app will be turned off
  // When the user will log out
  const setOfflineStatus = useCallback(async () => {
    if (user && authUsername) {
      userCollection()
        .doc(user.uid)
        .update("online", false)
        .then(() => {
          userCollection()
            .doc(user.uid)
            .update(
              "lastSeen",
              firebase.firestore.FieldValue.serverTimestamp()
            );
        })
        .catch();
    }
  }, [authUsername, user]);

  useEffect(() => {
    // Before unload set user's status to offline
    window.addEventListener("beforeunload", async (e) => {
      e.preventDefault();
      e.returnValue = "";
      await setOfflineStatus().then();
    });
    return () => {
      setOfflineStatus().then().catch();
    };
  }, [setOfflineStatus]);

  useEffect(() => {
    // After user is loaded
    if (user) {
      // If authenticated user's name has not been set
      // Then open popup/modal to set the current user's username
      // Very important
      getUserName().then((r) => {
        const username = r?.username || "";
        setAuthUsername(username);
        if (!username) {
          onOpen();
        }
        saveUserData(username, () => {
          setAuthUsername(username);
        });
      });
    }
  }, [checkUsernameExists, getUserName, onOpen, saveUserData, user]);

  // Handle user's username check if
  // username is still available then save username
  const saveUserName = () => {
    setLoading(true);
    checkUsernameExists(username).then((exists) => {
      if (exists) {
        setError("Username taken");
      } else {
        saveUserData(username, () => {
          setAuthUsername(username);
          setLoading(false);
          onClose();
        });
      }
    });
  };

  return (
    <Theme>
      <AuthUserProvider signOutCallback={setOfflineStatus}>
        <UserDetailsContext.Provider
          value={{ user: user, username: authUsername }}
        >
          {<Component {...pageProps} />}
        </UserDetailsContext.Provider>
      </AuthUserProvider>
      <Modal
        isOpen={isOpen}
        onClose={() => {}}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set your username</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!error}>
              <FormLabel>Your username</FormLabel>
              <Input
                value={username}
                onChange={handleInput}
                placeholder="Username"
              />
              {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={saveUserName}
              disabled={!username || !!error}
              colorScheme="blue"
              type={"submit"}
              isLoading={loading}
              mr={3}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Theme>
  );
}

export default MyApp;
