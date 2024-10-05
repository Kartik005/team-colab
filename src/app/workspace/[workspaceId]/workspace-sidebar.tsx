import { useCurrentMember } from "@/features/members/api/use-current-member";
import useGetWorkSpace from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonalIcon, SendIcon } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-tem";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";



export const WorkspaceSidebar = () => {

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const [_open, setOpen] = useCreateChannelModal();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({ id: workspaceId });
    const { data: channels, isLoading: channelLoading } = useGetChannels({ workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });


    if (workspaceLoading || memberLoading) {
        return (
            <div className="flex flex-col bg-[#121212] h-full items-center justify-center">
                <Loader className="size-5 animate-spin" />
            </div>
        )
    }

    if (!member || !workspace) {
        return (
            <div className="flex flex-col bg-[#121212] h-full items-center justify-center">
                <AlertTriangle className="size-5" />
                <p className="text-sm">
                    Workspace or member not found
                </p>
            </div>
        )
    }

    // <div className="flex flex-col bg-[#643461] h-full items-left justify-between">
    return (
        <div className="flex flex-col bg-[#FD8B51] h-full items-left justify-start">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
                    {/* <div className="flex flex-col px-2 mt-3">

                        <SidebarItem
                            label="Threads"
                            icon={MessageSquareText}
                            id="threads"
                        // variant="active"
                        />
                        <SidebarItem
                            label="Drafts and Sent"
                            icon={SendIcon}
                            id="drafts"
                        // variant="active"
                        />

                    </div> */}

    {/* channels, messages section */}
                        
            <WorkspaceSection
                label="Channels"
                hint="New channel"
                showButton={true}
                onNew={member.role === "admin" ? () => setOpen(true) : undefined}
            >
    {/* channels */}
                {channels?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        icon={HashIcon}
                        label={item.name}
                        id={item._id}
                        variant={channelId === item._id ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>

            <WorkspaceSection
                label="Members"
                hint="Current members of the channel"
                showButton={false}
                // label="Direct messages"
                // hint="New direct message"
                onNew={() => { }}
            >
                {members?.map((item) => (
                    <UserItem
                        key={item._id}
                        id={item._id}
                        label={item.user.name}
                        image={item.user.image}
                    // variant={member.} 
                    />
                ))}
            </WorkspaceSection>
            {/* </div> */}
        </div>
    )
}
