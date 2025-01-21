"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
  workflowId: string
}

const NavigationTabs = ({ workflowId }: Props) => {
  const pathname = usePathname()
  const active = pathname?.split("/")[2]

  return (
    <Tabs
      value={active}
      className="w-[16rem] rounded-full"
      defaultValue="workflows"
    >
      <TabsList className="grid w-full grid-cols-2 rounded-full">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full rounded-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full rounded-full">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}

export default NavigationTabs
