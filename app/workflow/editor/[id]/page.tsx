import React from "react"

type Props = {
  params: Promise<{
    id: string
  }>
}

const WorkflowEditorPage = async ({ params }: Props) => {
  const { id } = await params
  return <div>WorflowPage {id}</div>
}

export default WorkflowEditorPage
