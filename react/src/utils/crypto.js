const SECRET_KEY = "PPApmoLni2k25000";

// Encrypt Data (Before storing in localStorage)
export const encryptData = async (data) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const encodedKey = encoder.encode(SECRET_KEY);

  const cryptoKey = await crypto.subtle.importKey(
      "raw",
      encodedKey,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV for security

  const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      cryptoKey,
      encodedData
  );

  return JSON.stringify({
      iv: Array.from(iv),
      data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  });
};

// Decrypt Data (Retrieve from localStorage)
export const decryptData = async (encryptedData) => {
  if (!encryptedData) return null;
  
  const parsedData = JSON.parse(encryptedData);
  const encodedKey = new TextEncoder().encode(SECRET_KEY);

  const cryptoKey = await crypto.subtle.importKey(
      "raw",
      encodedKey,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
  );

  const iv = new Uint8Array(parsedData.iv);

  const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      cryptoKey,
      new Uint8Array(
          atob(parsedData.data)
              .split("")
              .map((char) => char.charCodeAt(0))
      )
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
};