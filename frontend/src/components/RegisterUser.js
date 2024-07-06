import axios from "axios";
import { generateKeyPair, encryptPrivateKey } from "../utils/crypto";
import { useNavigate } from "react-router-dom";

export const handleRegister = async (e, username, password, setMessage, navigate) => {
  e.preventDefault();
  const navigate = useNavigate();

  try {
    const { publicKey, privateKey } = await generateKeyPair();
    const encryptedPrivateKey = await encryptPrivateKey(password, privateKey);

    const response = await axios.post("/register", {
      username,
      password,
      publicKey,
      encryptedPrivateKey,
    });

    if (response.status === 200) {
      setMessage(response.data.message);
      // Redirect to login page after successful registration without reloading
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  } catch (error) {
    setMessage(error.response ? error.response.data : "Registration failed");
  }
};
