"use client"

import Link from "next/link"

import React from "react"
import { useQuery } from "@tanstack/react-query"

import { getUserBalance } from "@/actions/credits"
import { Coins, CoinsIcon, Loader2 } from "lucide-react"

type Props = {}

const UserAvailableBalance = (props: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-balance"],
    queryFn: () => getUserBalance(),
    refetchInterval: 30 * 1000,
  })

  return (
    <Link
      href="/billing"
      className="flex items-center gap-2 border rounded-full px-2 py-1"
    >
      <Coins size={16} className="text-primary" />
      <span className="text-sm">
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {!isLoading && data && data}
        {!isLoading && data === undefined && "-"}
      </span>
    </Link>
  )
}

export default UserAvailableBalance
