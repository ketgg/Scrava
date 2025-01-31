import { setupUser } from "@/actions/setup"
import React from "react"

type Props = {}

const SetupPage = async (props: Props) => {
  return await setupUser()
}

export default SetupPage
