import { useCallback } from "react"
import { useReactFlow } from "@xyflow/react"
import { toast } from "sonner"

import useFlowValidation from "./use-flow-validation"

import {
  flowToExecutionPlan,
  FlowToExecutionPlanValidationError,
} from "@/lib/helpers/workflow"

import { AppNode, AppNodeInvalidInputs } from "@/types/app-node"

const useExecutionPlan = () => {
  const { toObject } = useReactFlow()
  const { setNodesWithInvalidInputs, clearErrors } = useFlowValidation()

  const handleError = useCallback(
    (error: {
      type: FlowToExecutionPlanValidationError
      nodesWithInvalidInputs?: AppNodeInvalidInputs[]
    }) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found")
          break
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Input values are not set correctly")
          setNodesWithInvalidInputs(
            error.nodesWithInvalidInputs ? error.nodesWithInvalidInputs : []
          )
          break
        default:
          toast.error("Something went wrong")
      }
    },
    [setNodesWithInvalidInputs]
  )

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject()
    const { executionPlan, error } = flowToExecutionPlan(
      nodes as AppNode[],
      edges
    )
    if (error) {
      handleError(error)
      return null
    }

    clearErrors()
    return executionPlan
  }, [toObject, handleError, clearErrors])

  return generateExecutionPlan
}

export default useExecutionPlan
