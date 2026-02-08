import { get, ref } from "firebase/database";
import { db } from "../config/firebase-config.js";

export const getUserByHandle = async (handle) => {
  return get(ref(db, `users/${handle}`));
};
