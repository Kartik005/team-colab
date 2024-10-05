import { Button } from "@/components/ui/button";
import useGetWorkSpace from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import { Hint } from "@/components/hint";

import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { PreferencesModal } from "./preferences-modal";
import { useState } from "react";
import { InviteModal } from "./invite-modal";

interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">;
    isAdmin: boolean;
}


export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {

    const [preferencesOpen, setPreferencesOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);

    return (
        <>
        <InviteModal
        open = {inviteOpen}
        setOpen ={setInviteOpen}
        name = {workspace.name}
        joinCode = {workspace.joinCode}
        />
            <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={workspace.name} />
            <div className="bg-[#CB6040] flex items-center justify-between px-4 h-[49px] gap-0.5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="transparent"
                            className="font-semibold text-lg w-auto p-1.5 rounded-md hover:bg-gray-100 hover:text-slate-800 transition-colors"
                            size="sm"
                        >
                            <span className="truncate">{workspace?.name}</span>
                            <ChevronDown className="ml-2" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        side="bottom"
                        align="start"
                        className="w-64 bg-white bg-opacity-100 text-black shadow-lg rounded-md p-2"
                        
                    >
                        <DropdownMenuItem
                            className="cursor-pointer capitalize bg-white hover:bg-gray-100 text-black flex items-center p-2 rounded-md"
                        >
                            <div className="w-9 h-9 bg-gray-600 text-white text-xl font-semibold rounded-full flex items-center justify-center">
                                {workspace?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col ml-2">
                                <p className="font-bold text-black">{workspace?.name}</p>
                                <p className="text-xs text-gray-500">Active workspace</p>
                            </div>
                        </DropdownMenuItem>

                        {isAdmin && (
                            <>
                                <DropdownMenuItem
                                    className="cursor-pointer py-2 text-sm text-black hover:bg-gray-100 rounded-md"
                                    onClick={() => setInviteOpen(true)}
                                >
                                    Invite people to <strong>{workspace?.name}</strong>
                                </DropdownMenuItem>

                                {/* preferences */}
                                <DropdownMenuItem
                                    className="cursor-pointer py-2 text-sm text-black hover:bg-gray-100 rounded-md"
                                    onClick={() => setPreferencesOpen(true)}
                                >
                                    Preferences
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* <div className="flex items-center gap-0.5">
                    <Hint label="Filter" side="bottom">
                        <Button variant="transparent" size="sm">
                            <ListFilter className="size-4" />
                        </Button>
                    </Hint>
                    <Hint label="New message" side="bottom">
                        <Button variant="transparent" size="sm">
                            <SquarePen className="size-4" />
                        </Button>
                    </Hint>
                </div> */}
            </div>
        </>
    );
};
