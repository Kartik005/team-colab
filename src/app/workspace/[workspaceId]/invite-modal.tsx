import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DialogClose } from "@radix-ui/react-dialog";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";


interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {

    const workspaceId = useWorkspaceId();
    const { mutate, isPending} = useNewJoinCode();

    const handleCopy = () => {
        // redirect to this page when we use the join link
        const inviteLink = `${window.location.origin}/join/${workspaceId}`

        navigator.clipboard.writeText(inviteLink)
            .then(() => toast.success("Copied to clipboard"));
    }

    const handleNewCode = () =>{
        mutate({workspaceId}, {
            onSuccess: ()=>{
                toast.success("Generate new code");
            },
            onError: () =>{
                toast.error("Problem in generating new code");
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Invite others to {name}
                    </DialogTitle>
                    <DialogDescription>
                        Invite others by sharing the join code
                    </DialogDescription>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>

                        <Button 
                        onClick={handleCopy}
                        variant="ghost"
                        size="sm"
                        >
                            Copy Link
                            <CopyIcon className="size-4 ml-2"/>
                        </Button>
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>

                        {/* new join code */}
                        <Button 
                        disabled={isPending}
                        onClick={handleNewCode}
                        variant="outline">
                            Generate a new code

                        </Button>

                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
