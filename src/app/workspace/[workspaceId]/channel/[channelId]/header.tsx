// "use client"

import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

import {
    Dialog,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
    name: string;
}

export const Header = ({ name }: HeaderProps) => {

    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete channel?",
        "Deleted channels can not be recovered");

    const [value, setValue] = useState(name);
    const [editOpen, setEditOpen] = useState(false);

    const { data: member } = useCurrentMember({ workspaceId });
    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
    const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();

    // const handleEditOpen = (value: boolean) => {
        const handleEditOpen = () => {
        if (member?.role !== "admin") return;
        setEditOpen(true);

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    }

    // delete channel
    const handleDelete = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeChannel({ id: channelId }, {
            onSuccess: () => {
                toast.success("Channel deleted successfully");
                router.replace(`/workspace/${workspaceId}`); // redirect to workspace, as from here we are directly redirected to any other channel or prompted to create a new channel
            },
            onError: () => {
                toast.error("Failed to delete channel!");
            }
        });
    }

    // change channel name
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // we get mutate fxn from hook, this 
        updateChannel({ id: channelId, name: value }, {
            onSuccess: () => {
                toast.success("Updated channel successfully!");
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update channel!");
            }

        })
    }



    return (
        <div className="bg-[#121212] border-b h-[49px] flex items-center px-4 overflow-hidden">
            {/* Header: {name} */}
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-lg font-semibold px-2 overflow-hidden w-auto"
                        size="sm"
                    >
                        <span className="truncate">
                            # {name}
                        </span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-[#121212]">
                        <DialogTitle>
                            # {name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>


                                {/* edit button div */}
                                <div className="px-5 py-4 bg-[#121212] rounder-lg border cursor-pointer hover:bg-slate-700">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">Channel name</p>

                                        {member?.role === "admin" && (
                                            <p className="text-sm text-[#12643] hover:underline font-semibold">
                                                Edit
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm"># {name}</p>
                                </div>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename channel
                                    </DialogTitle>
                                </DialogHeader>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4">

                                    {/* input new name */}
                                    <Input
                                        value={value}
                                        disabled={isUpdatingChannel}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="e.g. trip to goa"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isUpdatingChannel}>
                                                Cancel
                                            </Button>

                                        </DialogClose>

                                        <Button disabled={isUpdatingChannel}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* delete button */}
                        {member?.role && (
                            <button
                                onClick={handleDelete}
                                disabled={isRemovingChannel}
                                className="flex items-center gap-x-2 px-5 py-4 bg-[#121212] rounded-lg cursor-pointer border hover:bg-slate-700 text-rose-500">
                                <TrashIcon className="size-4" />
                                <p> Delete Channel</p>
                            </button>

                        )}

                    </div>
                </DialogContent>

            </Dialog>
        </div>
    )
}
