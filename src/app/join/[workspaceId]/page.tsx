"use client"

import { Button } from "@/components/ui/button"
// import useGetWorkSpace from "@/features/workspaces/api/use-get-workspace"
import useGetWorkSpaceInfo from "@/features/workspaces/api/use-get-workspace-info"
import { useJoin } from "@/features/workspaces/api/use-join"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import VerificationInput from "react-verification-input"
import { toast } from "sonner"



const JoinPage = () => {

    const router = useRouter();

    const workspaceId = useWorkspaceId();

    // const { mutate, isPending } = useJoin();
    const { mutate} = useJoin();
    const { data, isLoading } = useGetWorkSpaceInfo({ id: workspaceId });

    const isMember = useMemo( ()=> data?.isMember, [data?.isMember]);

    // members get redirected to workspace when they try the join link
    useEffect( ()=>{
        if(isMember){
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId]);

    const handleComplete = (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`);
                toast.success("Successfully joined");
            },
            onError: () => {
                toast.error("Code expired or incorrect");
                // toast.error(E.message);
            }
        })

    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">

                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white text-[#121212] p-8 rounded-lg shadow-md">
            <Image src="/for-dummies-1.svg" width={60} height={60} alt="logo" />

            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text=4xl font-bold">
                        {/* Have an invite code? */}
                        Join {data?.name}
                    </h1>
                    <p className="text-md text-muted-foreground">
                        Enter code below to join
                    </p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    length={6}
                    autoFocus />
            </div>
            <div>
                <Button
                    variant="outline"
                    asChild>
                    <Link href="/">
                        Back to home
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default JoinPage