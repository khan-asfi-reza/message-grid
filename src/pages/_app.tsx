import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthUserProvider, UserDetailsContext } from "../context/AuthContext";
import Theme from "../layout/Theme";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase.conf";
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { userCollection } from "@db/collections";
import {
  Button,
  Center,
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
import { Loader } from "@component/Loader";

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth as any);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const loadingModal = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkUsernameExists = useCallback(async (_name) => {
    const userCollectionRef = await userCollection()
      .where("username", "==", _name)
      .get();
    return userCollectionRef?.docs.length > 0;
  }, []);

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

  const getUserName = useCallback(async () => {
    if (user) {
      const userCollectionRef = await userCollection()
        .where("email", "==", user.email)
        .get();
      return userCollectionRef?.docs.at(0).data();
    }
  }, [user]);

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
            },
            { merge: true }
          )
          .then(callback)
          .catch();
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      loadingModal.onOpen();
      getUserName().then((r) => {
        loadingModal.onClose();
        const username = r.username || "";
        setAuthUsername(username);
        if (!username) {
          onOpen();
        }
        checkUsernameExists(username).then((exists) => {
          if (!exists) {
            saveUserData(username, () => {
              setAuthUsername(username);
            });
          } else {
            setError("Username taken");
          }
        });
      });
    }
  }, [checkUsernameExists, getUserName, onOpen, saveUserData, user]);

  const saveUserName = () => {
    setLoading(true);
    saveUserData(username, () => {
      setLoading(false);
      onClose();
    });
  };

  return (
    <Theme>
      <AuthUserProvider>
        <UserDetailsContext.Provider
          value={{ user: user, username: authUsername }}
        >
          {<Component {...pageProps} />}
        </UserDetailsContext.Provider>
      </AuthUserProvider>
      <Modal onClose={() => {}} size={"full"} isOpen={loadingModal.isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Center height={"100%"} width={"100%"}>
              <Loader />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
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
