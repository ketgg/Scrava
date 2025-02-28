import React from "react"

type Props = {
  children: React.ReactNode
}

const NodeInputs = ({ children }: Props) => {
  return <div className="flex flex-col gap-1">{children}</div>
}

export default NodeInputs
