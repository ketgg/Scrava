"use server"

import { prisma } from "@/lib/prisma"
import {
  createCredentialSchema,
  CreateCredentialSchemaType,
} from "@/schema/credential"
import { auth } from "@clerk/nextjs/server"
import { symmetricEncrypt } from "../lib/helpers/encryption"
import { revalidatePath } from "next/cache"

export const getCredentialsForUser = async () => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  return prisma.credentials.findMany({
    where: { userId },
    orderBy: {
      name: "asc",
    },
  })
}

export const createCredential = async (form: CreateCredentialSchemaType) => {
  const { success, data } = createCredentialSchema.safeParse(form)
  if (!success) {
    throw new Error("Invalid form data.")
  }

  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const encryptedValue = symmetricEncrypt(data.value)
  const result = await prisma.credentials.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  })

  if (!result) {
    throw new Error("Failed to create the credential.")
  }

  revalidatePath("/credentials")
}

export const deleteCredential = async (name: string) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }
  // TODO - Add a check if any workflow is using that credential
  await prisma.credentials.delete({
    where: {
      userId_name: {
        userId,
        name,
      },
    },
  })

  revalidatePath("/credentials")
}
