import { Dispatch, SetStateAction, createContext, useState } from "react"
import { AppNodeInvalidInputs } from "@/types/app-node"

type FlowValidationContextType = {
  nodesWithInvalidInputs: AppNodeInvalidInputs[]
  setNodesWithInvalidInputs: Dispatch<SetStateAction<AppNodeInvalidInputs[]>>
  clearErrors: () => void
}

export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null)

export const FlowValidationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [nodesWithInvalidInputs, setNodesWithInvalidInputs] = useState<
    AppNodeInvalidInputs[]
  >([])

  const clearErrors = () => setNodesWithInvalidInputs([])

  return (
    <FlowValidationContext.Provider
      value={{ nodesWithInvalidInputs, setNodesWithInvalidInputs, clearErrors }}
    >
      {children}
    </FlowValidationContext.Provider>
  )
}
