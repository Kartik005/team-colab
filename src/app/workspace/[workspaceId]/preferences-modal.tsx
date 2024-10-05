import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter

} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Proceed to delete workspace?",
    "Deleted workspaces can not be recovered");

    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    const handleRemove = async () => {

        const ok = await confirm();

        if(!ok) return;

        removeWorkspace({
            id: workspaceId,

        }, {
            onSuccess: () => {
                router.replace("/");
                toast.success("Workspace has been deleted")
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to delete workspace")
            }
        }
        );
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateWorkspace({
            id: workspaceId,
            name: value,
        }, {
            onSuccess: () => {
                toast.success("Workspace name changed")
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to change workspace name")
            }
        }
        );
    }

    return (
        <>
        <ConfirmDialog/>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 vg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-[#121212]">
                    <DialogTitle>
                        {value}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <div className=" px-5 py-4 bg-black rounded-lg border cursor-pointer hover:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">
                                        Workspace name

                                    </p>
                                    <p className=" text-sm text-[#1264a3] hover:underline font-semibold">
                                        Edit
                                    </p>


                                </div>
                                <p className="text-sm">
                                    {value}
                                </p>

                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Rename this workspace</DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleEdit}>
                                <Input
                                    value={value}
                                    disabled={isUpdatingWorkspace}
                                    onChange={(e) => setValue(e.target.value)}
                                    required
                                    autoFocus
                                    minLength={3}
                                    maxLength={80}
                                    placeholder="Wokspace name, e.g. 'work' 'Games'"
                                // left here
                                />

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" disabled={isUpdatingWorkspace}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={isUpdatingWorkspace}>
                                        Save
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* delete workspace */}
                    <button
                        disabled={isRemovingWorkspace}
                        onClick={handleRemove}
                        className="flex justify-center gap-x-2 px-5 py-4 bg-black rounded-lg border cursor-pointer hover:bg-slate-900 text-rose-600 "
                    >
                        <TrashIcon />
                        <p>Delete Workspace</p>
                    </button>
                </div >
            </DialogContent >
        </Dialog >
        </>
    )
}
