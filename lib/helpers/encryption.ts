import crypto from "crypto"

import "server-only"

const ALGO = "aes-256-cbc"

// Symmetric as we will be using same key for encrypt and decrypt
export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY // openssl rand -hex 32
  if (!key) throw new Error("Missing Encryption_Key")

  // intialization vector
  // ensures that if the same data is encrypted multiple times
  // the result is always different
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(ALGO, Buffer.from(key, "hex"), iv)

  let encryptedData = cipher.update(data)
  // Add leftover encrypted blocks
  encryptedData = Buffer.concat([encryptedData, cipher.final()])

  return iv.toString("hex") + ":" + encryptedData.toString("hex")
}

export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error("Missing Encryption_Key")

  const textParts = encrypted.split(":")

  const iv = Buffer.from(textParts[0] as string, "hex")
  const encryptedData = Buffer.from(textParts[1], "hex")

  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(key, "hex"), iv)

  let decryptedData = decipher.update(encryptedData)
  decryptedData = Buffer.concat([decryptedData, decipher.final()])

  return decryptedData.toString()
}
