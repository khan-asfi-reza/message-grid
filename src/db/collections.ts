import { db } from "../firebase.conf";

export const userCollection = () => db.collection("users");

export const chatCollection = () => db.collection("chat");
