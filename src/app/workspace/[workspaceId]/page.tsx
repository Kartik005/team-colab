// dynamic part of url is passed as params to page.tsx

"use client"

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import useGetWorkSpace from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";


const WorkspaceIdPage = ()=>{
  // data of current workspace
  
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  
  const [open, setOpen] = useCreateChannelModal();
  
  const { data: member, isLoading: memberLoading} = useCurrentMember({workspaceId});
  const {data: workspace, isLoading: workspaceLoading} = useGetWorkSpace({id: workspaceId});
  const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId});

  const channelId = useMemo( () => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo( ()=> member?.role === "admin", [member?.role]);

  useEffect( () =>{
    if(workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return; // if any happens, we don't execute useEffect

    if(channelId){
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    }
    
    // if no channel, create channel option
    else if(!open && isAdmin){
      setOpen(true); 
    }
    
  }, [channelId,
    workspaceLoading,
    channelsLoading,
    workspace, 
    open, 
    setOpen, 
    router, 
    workspaceId,
    // vercel said to include these
    isAdmin,
    member,
    memberLoading,
  ]);

  if(workspaceLoading || channelsLoading || memberLoading){
    return(
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-5 animate-spin text-muted-foreground"
        />
      </div>
    )
  }

  if(!workspace || !member){
    return(
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">

        <TriangleAlert className="size-6 text-muted-foreground"/>
        <span className="text-sm text-muted-foreground">
          Workspace not Found
        </span>
      </div>
    )
  }

  return(
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">

      <TriangleAlert className="size-6 text-muted-foreground"/>
      <span className="text-sm text-muted-foreground">
        No channel exists 
      </span>
    </div>
  )

  
}

export default WorkspaceIdPage;

// interface WorkspaceIdPageProps {
//   params: {
//     workspaceId: string,
//   }
// }

// const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
//   return (
//     <div>ID: {params.workspaceId}</div>
//   )
// }

// export default WorkspaceIdPage

// "use client"

// import { useParams } from "next/navigation"

// const workspaceIdPage = ()=>{
//    const params = useParams();

//    return(
//     <div>
//       ID :{params.workspaceId}
//     </div>
//    )
// }

// export default workspaceIdPage