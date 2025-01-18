"use client"

import React from "react"

import { ReactFlowProvider } from "@xyflow/react"

import { Workflow } from "@prisma/client"

import Topbar from "./topbar"
import FlowEditor from "./flow-editor"

type Props = {
  workflow: Workflow
}

const Editor = ({ workflow }: Props) => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Topbar
          title="Workflow Editor"
          subtitle={workflow.name}
          workflowId={workflow.id}
        />
        <section className="flex h-full overflow-auto">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  )
}

export default Editor
