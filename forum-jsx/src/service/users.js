import { get, ref } from "firebase/database";
import { db } from "../config/firebase-config.js";

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};
// ако постоянно презарежда , не трябва да е async операция !!!
