import React from "react"
import { CircleDashed, LucideIcon } from "lucide-react"

type Props = {
  icon: LucideIcon
  label: React.ReactNode
  value: React.ReactNode
}

const ExecutionLabel = ({ icon, label, value }: Props) => {
  const Icon = icon
  return (
    <div className="flex items-center justify-between py-2 px-4 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={20} className="stroke-muted-foreground" />
        <span>{label}</span>
      </div>
      <div className="flex items-center capitalize gap-2 font-medium">
        {value}
      </div>
    </div>
  )
}

export default ExecutionLabel
