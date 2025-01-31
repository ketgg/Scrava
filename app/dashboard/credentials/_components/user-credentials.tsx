import React from "react"

import { getCredentialsForUser } from "@/actions/credentials"
import { Card, CardContent } from "@/components/ui/card"
import {
  LockKeyhole,
  Shield,
  ShieldAlert,
  ShieldBan,
  ShieldIcon,
  ShieldOff,
} from "lucide-react"
import CreateCredential from "./create-credential"
import { formatDistanceToNow } from "date-fns"
import DeleteCredential from "./delete-credential"

type Props = {}

const UserCredentials = async (props: Props) => {
  const credentials = await getCredentialsForUser()

  if (!credentials) {
    return <div>Something went wrong</div>
  }
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4 shadow-sm">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldOff size={40} className="stroke-primary" />
          </div>

          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created yet.</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredential triggerText="Create your first credential" />
        </div>
      </Card>
    )
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        })
        return (
          <Card
            key={credential.id}
            className="w-full p-4 flex shadow-sm justify-between"
          >
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                <LockKeyhole size={16} className="stroke-primary" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            <DeleteCredential name={credential.name} />
          </Card>
        )
      })}
    </div>
  )
}

export default UserCredentials
