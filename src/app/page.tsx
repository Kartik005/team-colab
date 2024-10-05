"use client"

import UserButton from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import useGetWorkSpaces from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkSpaces();

  
  // each table has _id and _creationTime fields by default
  const workspaceid = useMemo(() => data?.[0]?._id, [data])

  useEffect(() => {
    if (isLoading) return;

    if(workspaceid){
      console.log("redirect to workspace")
      // navigate to workspace id
      // after logged in, redirected directlt to first workspace if it exists
      router.replace(`/workspace/${workspaceid}`);
    }
    else if(!open){
      setOpen(true);
      console.log("open creation modal")
    }

  }, [workspaceid, isLoading, open, setOpen, router]);

  return (
    <div className="text-bold text-rose-500 text-2xl">
      <UserButton>

      </UserButton>
    </div>
  )
}