import * as crypto from "crypto";

const ENC = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-ctr";

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

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(ALGO, ENC, IV);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

export const decrypt = (text: string): string => {
  const decipher = crypto.createDecipheriv(ALGO, ENC, IV);
  const decrypted = decipher.update(text, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
