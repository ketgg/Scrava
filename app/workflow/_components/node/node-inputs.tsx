import React from "react"

type Props = {
  children: React.ReactNode
}

const NodeInputs = ({ children }: Props) => {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>
}

export default NodeInputs
