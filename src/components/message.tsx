// to display a single message from sender or reciever
import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorName?: string;
    authorImage?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimeStamp?: number;

}

export const Message = ({
    id,
    isAuthor,
    memberId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimeStamp,

}: MessageProps) => {

    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                <div className="flex items-start gap-2">
                    <Hint label="Sent time">

                    <button className="text-xs text-[#CB6040] opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                        {format(new Date(createdAt), "hh:mm")}
                    </button>
                    </Hint>

                    {/* render the message body into actual formatting */}
                    <div className="flex flex-col w-full">
                        <Renderer value={body} />
                        <Thumbnail url={image}/>
                        {
                            updatedAt ? <span className="text-xs">(edited)</span>
                                : null
                        }
                    </div>
                </div>

            </div>
        )
    }

    const avatarFallback = authorName.charAt(0).toUpperCase();

    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-400/60 group relative">
            <div className="flex items-start gap-2">
                {/* TODO: change color text-rose-300 here */}
                <button>
                    <Avatar className='size-5 rounded-full mr-1'>
                        <AvatarImage className='rounded-full' src={authorImage} />
                        <AvatarFallback className='text-xs rounded-full bg-red-500 text-white'>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </button>

                <div className="flex flex-col w-full overflow-hidden">
                    <div className="text-sm">
                        <button
                            onClick={() => { }}
                            className="font-bold text-slate-600 hover:underline">
                            {authorName}
                        </button>

                        <span>&nbsp;&nbsp;</span>
                        <button className="text-xs text-[#CB6040] hover:underline">
                            Sent at {format(new Date(createdAt), "hh:mm")}
                        </button>

                    </div>
                    <Renderer value={body} />
                    <Thumbnail url={image}/>
                    {
                        updatedAt ? <span className="text-xs">(edited)</span>
                            : null
                    }

                </div>
            </div>
            {/* render the message body into actual formatting */}

        </div>
    )
}