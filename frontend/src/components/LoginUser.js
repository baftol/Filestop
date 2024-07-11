import axios from "axios";
import { set as idbSet } from "idb-keyval";
import { get as idbGet } from "idb-keyval";
import * as crypto from "../utils/crypto";

export const handleLogin = async (e, username, password, setMessage, navigate) => {
  e.preventDefault();
  try {
    const hashedPassword = await crypto.hashPassword(password, username);
    const response = await axios.post("/api/login", {
      // change to /api/login
      username,
      password: hashedPassword,
    });

    if (response.status === 200) {
      const derivedKey = await crypto.deriveKeyFromPassword(password, username);
      await idbSet("encryptinKey", derivedKey);
      // Store the JWT token in a cookie

      // Derive the key from the password

      // this key is used to encrypt private key
      setMessage("Login Successful");
    }
  } catch (error) {
    return { success: false, message: error.response ? error.response.data : "Login failed" };
  }
};
