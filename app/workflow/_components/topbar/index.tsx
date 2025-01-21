"use client"

import { useRouter } from "next/navigation"

import React from "react"

import { ChevronLeft } from "lucide-react"

import TooltipWrapper from "@/components/wrapper/tooltip"
import { Button } from "@/components/ui/button"

import ExecuteButton from "./execute-btn"
import SaveButton from "./save-btn"
import NavigationTabs from "./navigation-tabs"

type Props = {
  title: string
  subtitle?: string
  workflowId: string
  hideButtons?: boolean
}

const Topbar = ({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
}: Props) => {
  const router = useRouter()
  return (
    <header className="flex justify-between p-2 border-b border-separate w-full h-14 sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back" side="bottom">
          <Button
            onClick={() => router.back()}
            className="rounded-full"
            variant="ghost"
            size="icon"
          >
            <ChevronLeft />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground text-ellipsis truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-2 flex-1 items-center justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            <SaveButton workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  )
}

export default Topbar
