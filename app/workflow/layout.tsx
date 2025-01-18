import React from "react"
import { Separator } from "@/components/ui/separator"
import { NavData } from "@/app/dashboard/_components/nav-logo"
type Props = {
  children: React.ReactNode
}

const WorkflowLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2 gap-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
          <NavData.logo className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{NavData.name}</span>
          <span className="truncate text-xs">{NavData.plan}</span>
        </div>
      </footer>
    </div>
  )
}

export default WorkflowLayout
