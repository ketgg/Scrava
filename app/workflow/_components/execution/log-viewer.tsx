import React from "react"

import { ExecutionLog } from "@prisma/client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { LogLevel } from "@/types/log"

type Props = {
  logs: ExecutionLog[] | undefined
}

const LogViewer = ({ logs }: Props) => {
  if (!logs || logs.length === 0) return null
  return (
    <Card className="shadow-sm">
      <CardHeader className="">
        <CardTitle>Execution Logs</CardTitle>
        <CardDescription>Logs generated in this phase</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell width={200} className="text-muted-foreground">
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase font-semibold",
                    (log.logLevel as LogLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as LogLevel) === "warn" && "text-yellow-500",
                    (log.logLevel as LogLevel) === "info" && "text-primary"
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="flex-1">{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default LogViewer
