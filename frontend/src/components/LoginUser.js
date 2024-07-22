import axios from "axios";
import { set as idbSet } from "idb-keyval";
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
      await idbSet("encryptionKey", derivedKey);
      localStorage.setItem("username", username);
      setMessage("Login Successful");
    }
  } catch (error) {
    setMessage("Login Failed");
    return;
    // return { success: false, message: error.response ? error.response.data : "Login failed" };
  }
};
