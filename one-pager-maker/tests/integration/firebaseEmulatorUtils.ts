import { auth, db } from "@/firebase.ts";
import { connectFirestoreEmulator } from "firebase/firestore";
import { connectAuthEmulator } from "firebase/auth";

const host = "127.0.0.1";
const port = 4001;
const firestoreUri = `http://${host}:${port}/emulator/v1/projects/one-pager-maker/databases/(default)`;

export const useFirestoreEmulator = () =>
  connectFirestoreEmulator(db, host, port);

export const useAuthEmulator = () =>
  connectAuthEmulator(auth, `http://${host}:${9099}`);

export const deleteFirestoreEmulatorData = async () => {
  try {
    await fetch(`${firestoreUri}/documents`, { method: "DELETE" });
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};
