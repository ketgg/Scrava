import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {}

const UserWorkflowsSkeleton = (props: Props) => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  )
}

export default UserWorkflowsSkeleton
