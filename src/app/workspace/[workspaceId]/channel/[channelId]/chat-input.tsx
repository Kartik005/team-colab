import dynamic from "next/dynamic"
import { useRef, useState } from "react";
import Quill from "quill";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGenerateUploadUrl } from "@/components/upload/api/use-generate-upload-url";
import { Id } from "../../../../../../convex/_generated/dataModel";
import imageCompression from 'browser-image-compression';

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
    placeholder: string;
}

type createMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    body: string;
    image?: Id<"_storage">;


}

export const ChatInput = ({ placeholder }: ChatInputProps) => {

    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);
    // const [, setIsPending] = useState(false);

    const editorRef = useRef<Quill | null>(null);
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();
    const { mutate: createMessage } = useCreateMessage();

    const { mutate: generateUploadUrl } = useGenerateUploadUrl();

    const handleSubmit = async ({ body, image }: {

        body: string; image: File | null;
    }) => {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values: createMessageValues = {
                workspaceId,
                channelId,
                body,
                image: undefined,
            };

            if (image) {
                
                const compressedImage = await imageCompression(image, {
                    maxSizeMB: 1, // Set the maximum size (1MB in this case)
                    maxWidthOrHeight: 1024, // Maximum width or height to resize the image
                    useWebWorker: true, // Enable compression in a web worker thread
                });

                const url = await generateUploadUrl({ throwError: true });
                // this change is made along with removing the {} in generateUploadUrl
                // const url = await generateUploadUrl({}, { throwError: true });
                if (!url) {
                    throw new Error("image url not found");
                }
                // fetch api call
                const result = await fetch(url, {
                    method: "POST",
                    headers: { "Content-type": compressedImage.type },
                    body: compressedImage,
                });

                if (!result.ok) {
                    throw new Error("Failed to upload image!");
                }

                const { storageId } = await result.json();
                values.image = storageId;
            }

            await createMessage(

                values,
                { throwError: true });

            setEditorKey(key => key + 1);

        }
        catch (error) {
            toast.error("Failed to send message")
        }
        finally {
            setIsPending(false);
        }

        // create new editor eacy time
        // much better than clearing the text, the image and what not from the body


    }

    return (
        <div className='px-5 w-full'>
            <Editor
                key={editorKey} // when key changes, editor is rerendered newly
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    )
}
