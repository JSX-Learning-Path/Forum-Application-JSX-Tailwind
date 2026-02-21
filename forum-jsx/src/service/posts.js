import { get, ref } from "firebase/database";
import { db } from "../config/firebase-config.js";

// Взима всички постове
export const getAllPosts = () => {
  return get(ref(db, "posts"));
};