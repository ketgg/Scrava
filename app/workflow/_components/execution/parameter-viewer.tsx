import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Props = {
  title: string
  subtitle: string
  paramsJSON: string | undefined
}

const ParameterViewer = ({ title, subtitle, paramsJSON }: Props) => {
  const params = paramsJSON ? JSON.parse(paramsJSON) : undefined

  return (
    <Card className="shadow-sm">
      <CardHeader className="">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="">
        {(!params || Object.keys(params).length === 0) && (
          <p className="text-sm">No parameters generated in this phase</p>
        )}
        {params &&
          Object.keys(params).length > 0 &&
          Object.entries(params).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between space-y-1"
            >
              <p className="flex-1 basis-1/3 text-sm text-muted-foreground">
                {key}
              </p>
              <Input
                readOnly
                className="flex-1 basis-2/3"
                value={value as string}
              />
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

export default ParameterViewer
