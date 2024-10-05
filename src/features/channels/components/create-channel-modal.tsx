import { 
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogHeader,
    DialogTitle
 } from "@/components/ui/dialog";


 import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

 export const CreateChannelModal = () =>{

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState("");

    const { mutate, isPending} = useCreateChannel();

    const handleClose = () =>{
        setName("");
        setOpen(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) =>{
        e.preventDefault();

        mutate( 
            { name, workspaceId },
            {
                onSuccess: (id) =>{
                    toast.success("Channel created successfully!");
                    // redirect to new channel
                    router.push(`/workspace/${workspaceId}/channel/${id}`);
                    handleClose();
                },
                onError: ()=>{
                    toast.error("Can not create channel!");
                }
            }
        )
    }

    return(
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a new channel
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                    value={name}
                    disabled={isPending}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. trip, weekend, birthday planning"
                    />

                    <div className="flex justify-end">
                        <Button disabled={false}>   
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
            
        </Dialog>
    )
 }

