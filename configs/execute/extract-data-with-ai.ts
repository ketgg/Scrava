import { ExtractDataWithAITask } from "@/configs/workflow/task"
import { symmetricDecrypt } from "@/lib/helpers/encryption"
import { prisma } from "@/lib/prisma"

import OpenAI from "openai"

import { ExecutionEnv } from "@/types/executor"

export const extractDataWithAIExecutor = async (
  environment: ExecutionEnv<typeof ExtractDataWithAITask>
): Promise<boolean> => {
  try {
    // We are setting the value field as credential id for safety (although its encrypted val from db)
    const credentialId = environment.getInput("Credentials")
    if (!credentialId) {
      throw new Error("Input:Credential not defined.")
    }

    const prompt = environment.getInput("Prompt")
    if (!prompt) {
      throw new Error("Input:Prompt not defined.")
    }

    const content = environment.getInput("Content")
    if (!content) {
      throw new Error("Input:Content not defined.")
    }

    const cred = await prisma.credentials.findUnique({
      where: {
        id: credentialId,
      },
    })
    if (!cred) {
      environment.log.error("Credential not found.")
      return false
    }

    const decryptedCredValue = symmetricDecrypt(cred.value)
    if (!decryptedCredValue) {
      environment.log.error("Unable to decrypt the credential.")
      return false
    }

    // We can use openai sdk for deepseek as well
    // provided by openrouter
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: decryptedCredValue,
    })

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content:
            "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text. Don't use any backticks to represent the code snippet, just give the output in string format.",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    environment.log.info(`Prompt tokens used: ${response.usage?.prompt_tokens}`)
    environment.log.info(
      `Completion tokens used: ${response.usage?.completion_tokens}`
    )

    const result = response.choices[0].message.content
    if (!result) {
      environment.log.error("Got an empty response from AI")
      return false
    }

    environment.setOutput("Extracted Data", result)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
