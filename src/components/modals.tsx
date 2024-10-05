"use client"

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useEffect, useState } from "react"


export const Modals = () => {

    const [mounted, setMounted] = useState(false);

    // useEffect is called only when we are doing client side rendering

    // i.e. so this prevents hydration errors as modals are displayed when they render on client-side

    useEffect(() => {
        setMounted(true);
    }, [])


    if (!mounted) return null;

    return (
        <>
            <CreateChannelModal />
            <CreateWorkspaceModal />
        </>
    )
}