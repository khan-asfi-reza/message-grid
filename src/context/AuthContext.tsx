import { createContext, useContext } from "react";
import { useReducer, useState, useEffect } from "react";
import { auth, githubAuthProvider, googleAuthProvider } from "../firebase.conf";

// Google, GitHub, Email and Auth Loading State
const GOOGLE_TOGGLE_TRUE = "GOOGLE_TOGGLE_TRUE";
const GOOGLE_TOGGLE_FALSE = "GOOGLE_TOGGLE_FALSE";
const GITHUB_TOGGLE_TRUE = "GITHUB_TOGGLE_TRUE";
const GITHUB_TOGGLE_FALSE = "GITHUB_TOGGLE_FALSE";
const EMAIL_TOGGLE_TRUE = "EMAIL_TOGGLE_TRUE";
const EMAIL_TOGGLE_FALSE = "EMAIL_TOGGLE_FALSE";
const AUTH_TOGGLE_TRUE = "AUTH_TOGGLE_TRUE";
const AUTH_TOGGLE_FALSE = "AUTH_TOGGLE_FALSE";

// Loading State Blueprint
export interface loadingState {
  googleLoading: boolean;
  authLoading: boolean;
  githubLoading: boolean;
  emailLoading: boolean;
}

// Default Loading State
const loadingState: loadingState = {
  authLoading: true,
  googleLoading: false,
  githubLoading: false,
  emailLoading: false,
};

// Loading Reducer
const loadingReducer = (state: loadingState, action) => {
  switch (action.key) {
    case GOOGLE_TOGGLE_TRUE:
      return { ...state, googleLoading: true };
    case GOOGLE_TOGGLE_FALSE:
      return { ...state, googleLoading: false };
    case GITHUB_TOGGLE_TRUE:
      return { ...state, githubLoading: true };
    case GITHUB_TOGGLE_FALSE:
      return { ...state, githubLoading: false };
    case AUTH_TOGGLE_TRUE:
      return { ...state, authLoading: true };
    case AUTH_TOGGLE_FALSE:
      return { ...state, authLoading: false };
    case EMAIL_TOGGLE_TRUE:
      return { ...state, emailLoading: true };
    case EMAIL_TOGGLE_FALSE:
      return { ...state, emailLoading: false };
    default:
      return state;
  }
};

// Formats user from the state
const formatAuthUser = (user) =>
  user
    ? {
        uid: user.uid,
        email: user.email,
      }
    : null;

// For context only, Not for use
function useFirebaseAuth(signOutCallback) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, dispatch] = useReducer(loadingReducer, loadingState);

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    dispatch({ key: EMAIL_TOGGLE_TRUE });
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } finally {
      dispatch({ key: EMAIL_TOGGLE_FALSE });
    }
  };

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    dispatch({ key: EMAIL_TOGGLE_TRUE });
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } finally {
      dispatch({ key: EMAIL_TOGGLE_FALSE });
    }
  };

  const signInWithGoogle = async () => {
    dispatch({ key: GOOGLE_TOGGLE_TRUE });
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } finally {
      dispatch({ key: GOOGLE_TOGGLE_FALSE });
    }
  };

  const signInWithGithub = async () => {
    dispatch({ key: GITHUB_TOGGLE_TRUE });
    try {
      await auth.signInWithPopup(githubAuthProvider);
    } finally {
      dispatch({ key: GITHUB_TOGGLE_FALSE });
    }
  };

  const clear = async () => {
    setAuthUser(null);
    dispatch({ key: AUTH_TOGGLE_FALSE });
  };

  const signOut = async () => {
    await signOutCallback();
    await auth.signOut().then(clear);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch({ key: AUTH_TOGGLE_TRUE });
      setAuthUser(formatAuthUser(user));
      dispatch({ key: AUTH_TOGGLE_FALSE });
    });
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  };
}

const AuthUserContext = createContext({
  authUser: null,
  loading: loadingState,
  signInWithEmailAndPassword: async (email: string, password: string) => {},
  createUserWithEmailAndPassword: async (email: string, password: string) => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
});

export function AuthUserProvider({ children, signOutCallback }) {
  const auth = useFirebaseAuth(signOutCallback);
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}
// Custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);

export const UserDetailsContext = createContext({
  username: "",
  user: null,
});

export const useUserDetails = () => useContext(UserDetailsContext);
