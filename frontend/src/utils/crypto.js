export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt", "decrypt"],
  );

  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: arrayBufferToBase64(publicKey),
    privateKey: arrayBufferToBase64(privateKey),
  };
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export async function encryptPrivateKey(password, privateKey) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("s0ome_saalt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"],
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    str2ab(privateKey),
  );

  return JSON.stringify({
    iv: arrayBufferToBase64(iv),
    ciphertext: arrayBufferToBase64(encrypted),
  });
}

export async function hashPassword(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return arrayBufferToBase64(hash);
}

export async function importPublicKey(pem) {
  const binaryDerString = window.atob(pem);
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  );
}

export async function importPrivateKey(pem) {
  const binaryDerString = window.atob(pem);
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"],
  );
}

export async function decryptPrivateKey(encryptedPrivateKey, password) {
  const { iv, ciphertext } = JSON.parse(encryptedPrivateKey);
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("s0ome_saalt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"],
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToArrayBuffer(iv),
    },
    key,
    base64ToArrayBuffer(ciphertext),
  );

  return new TextDecoder().decode(decrypted);
}

export async function encryptFileAndMetadata(file, metadata, publicKey) {
  const fileBuffer = await file.arrayBuffer();
  const symKey = window.crypto.getRandomValues(new Uint8Array(32)); // Generate a random symmetric key
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV

  // Encrypt the file content with the symmetric key
  const encryptedFileBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    symKey,
    fileBuffer,
  );

  // Convert metadata to a JSON string and then to an ArrayBuffer
  const metadataBuffer = new TextEncoder().encode(JSON.stringify(metadata));

  // Encrypt the metadata with the symmetric key
  const encryptedMetadataBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    symKey,
    metadataBuffer,
  );

  // Encrypt the symmetric key with the public key
  const encryptedSymKey = await encryptSymmetricKey(symKey, publicKey);

  return {
    encryptedFile: new Blob([encryptedFileBuffer]),
    encryptedMetadata: arrayBufferToBase64(encryptedMetadataBuffer),
    encryptedSymKey,
    iv: arrayBufferToBase64(iv),
  };
}

export async function encryptSymmetricKey(symKey, publicKey) {
  const importedPublicKey = await importPublicKey(publicKey);
  const encryptedSymKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    importedPublicKey,
    symKey,
  );

  return arrayBufferToBase64(encryptedSymKey);
}

export async function decryptFileAndMetadata(encryptedFile, encryptedMetadata, encryptedSymKey, iv, privateKey) {
  const symKey = await decryptSymmetricKey(encryptedSymKey, privateKey);

  // Decrypt the file content
  const fileBuffer = await encryptedFile.arrayBuffer();
  const decryptedFileBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToArrayBuffer(iv),
    },
    symKey,
    fileBuffer,
  );

  // Decrypt the metadata
  const decryptedMetadataBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToArrayBuffer(iv),
    },
    symKey,
    base64ToArrayBuffer(encryptedMetadata),
  );

  const metadata = JSON.parse(new TextDecoder().decode(decryptedMetadataBuffer));

  return {
    decryptedFile: new Blob([decryptedFileBuffer], { type: metadata.type }),
    metadata: metadata,
  };
}

export async function decryptSymmetricKey(encryptedSymKey, privateKey) {
  const importedPrivateKey = await importPrivateKey(privateKey);
  const symKey = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    importedPrivateKey,
    base64ToArrayBuffer(encryptedSymKey),
  );

  return symKey;
}
