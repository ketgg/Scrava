import React from "react"

import { ParamProps } from "@/types/task"

const BrowserInstanceParam = ({
  param,
  value,
  updateNodeParamValue,
}: ParamProps) => {
  return <p className="text-xs">{param.name}</p>
}

export default BrowserInstanceParam
