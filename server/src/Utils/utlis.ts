import * as crypto from "crypto";

export const compareValues = (
  value1: string | number,
  value2: number
): boolean => {
  if (typeof value1 === "number") {
    return value1 > value2;
  } else {
    const numericValue1 = parseFloat(value1);
    if (!isNaN(numericValue1)) {
      return numericValue1 > value2;
    } else {
      return false;
    }
  }
};

export const encrypt = (text: string, key: string): string => {
  const cipher = crypto.createCipher("aes-256-cbc", key);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decrypt = (encryptedText: string, key: string): string => {
  const decipher = crypto.createDecipher("aes-256-cbc", key);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
