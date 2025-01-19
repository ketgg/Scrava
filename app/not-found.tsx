import Link from "next/link"
import React from "react"
import { ArrowLeft } from "lucide-react"

type Props = {}

const NotFoundPage = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-4">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-medium pr-4 mr-4 border-r border-primary/30">
          404
        </h1>
        <h2 className="text-sm">This page could not be found.</h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
