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
  const pathSegments = pathname.split("/")
  // console.log(pathSegments) // [ '', 'dashboard' ] or [ '', 'dashboard', 'workflows' ] ...
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* {pathSegments.map((segment, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink className="capitalize" href={`/${segment}`}>
              {segment === "" ? "home" : segment}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))} */}

        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={`/${pathSegments[1]}`} className="capitalize">
            {pathSegments[1]}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {!pathSegments[2] ? "Home" : pathSegments[2]}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
