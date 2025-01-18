"use client"

import { usePathname } from "next/navigation"
import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Props = {}

export const AppBreadcrumb = (props: Props) => {
  const pathname = usePathname()
  const pathSegments = pathname === "/" ? [""] : pathname.split("/")
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink className="capitalize" href={`/${segment}`}>
              {segment === "" ? "home" : segment}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        {/* <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
