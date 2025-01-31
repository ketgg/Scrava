import React, { useId } from "react"

import { OptionType, ParamProps } from "@/types/task"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { getCredentialsForUser } from "@/actions/credentials"

const CredentialParam = ({
  param,
  value,
  updateNodeParamValue,
}: ParamProps) => {
  const id = useId()

  const query = useQuery({
    queryKey: ["credentials-of-user"],
    queryFn: () => getCredentialsForUser(),
    refetchInterval: 10000,
  })

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}&nbsp;
        {param.required && <span className="text-red-400">*</span>}
      </Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => updateNodeParamValue(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential) => (
              <SelectItem key={credential.name} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default CredentialParam
