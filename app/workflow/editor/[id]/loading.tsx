import { Loader2 } from "lucide-react"
import React from "react"

type Props = {}

const LoadingPage = (props: Props) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2
        size={30}
        strokeWidth={1.5}
        className="animate-spin stroke-primary"
      />
    </div>
  )
}

export default LoadingPage
