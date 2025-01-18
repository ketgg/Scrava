"use client"

import React, { useId, useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { ParamProps } from "@/types/task"

const StringParam = ({ param, value, updateNodeParamValue }: ParamProps) => {
  const id = useId()
  const [internalValue, setInternalValue] = useState(value)
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        id={id}
        value={internalValue}
        className="w-full bg-background shadow-none text-sm"
        placeholder="Enter value here"
        onChange={(e) => setInternalValue(e.target.value)}
        // This is reduce the number of re-renders
        // TODO: Maybe we can use debounce technique here!
        onBlur={() => updateNodeParamValue(internalValue)}
      />
      {param.helperText && (
        <p className="text-muted-foreground text-xs px-1">{param.helperText}</p>
      )}
    </div>
  )
}

export default StringParam
