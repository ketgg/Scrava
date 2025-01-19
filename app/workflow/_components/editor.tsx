"use client"

import React from "react"

import { ReactFlowProvider } from "@xyflow/react"

import { Workflow } from "@prisma/client"

import { FlowValidationProvider } from "@/context/flow-validation-context"

import Topbar from "./topbar"
import FlowEditor from "./flow-editor"
import TaskMenu from "./task-menu"

type Props = {
  workflow: Workflow
}

const Editor = ({ workflow }: Props) => {
  return (
    <FlowValidationProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow Editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationProvider>
  )
}

export default Editor
