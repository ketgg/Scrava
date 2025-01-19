"use client"

import React, { useEffect, useId, useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { ParamProps } from "@/types/task"

const StringParam = ({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) => {
  const id = useId()
  const [internalValue, setInternalValue] = useState(value)

  // If the value is changed from the outside, update the internal value
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  let InputComponent: any = Input
  if (param.variant === "textarea") InputComponent = Textarea

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}&nbsp;
        {param.required && <span className="text-red-400">*</span>}
      </Label>
      <InputComponent
        disabled={disabled}
        id={id}
        value={internalValue}
        className="w-full bg-background shadow-none text-sm"
        placeholder="Enter value here"
        onChange={(e: any) => setInternalValue(e.target.value)}
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
