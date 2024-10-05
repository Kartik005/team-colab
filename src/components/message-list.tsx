import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";


const TIME_THRESHOLD = 5;

interface MessageListProps {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    channelCreationTIme?: number;
    variant?: "channel" | "thread" | "conversation";
    data: GetMessagesReturnType | undefined;
    loadMore: () => void;
    isLoadingMore: boolean;
    canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, MMMM d");
}

// export const MessageList = ({
//     memberName,
//     memberImage,
//     channelName,
//     channelCreationTIme,
//     variant = "channel",
//     data,
//     loadMore,
//     isLoadingMore,
//     canLoadMore,
// }: MessageListProps) => {

export const MessageList = ({
    data
}: MessageListProps) => {

    // group messages by date
    const groupMessages = data?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, "yyyy-MM-dd");

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].unshift(message);
            return groups;
        },
        {} as Record<string, typeof data>
    );

    return (
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
            {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
                <div key={dateKey}>
                    <div className="text-center my-2 relative">
                        <hr className="absolute top-1/2 left-0 border-t border-gray-300" />
                        <span className="relative inline-block bg-[#CB6040] px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                            {formatDateLabel(dateKey)}
                        </span>
                    </div>
                    {messages.map((message, index) => {
                        const prevMessage = messages[index - 1];
                        // if same person texting in TIME_THRESHOLD mins, 
                        //no need to display name and all every time
                        const isCompact =
                            prevMessage
                            && prevMessage.user?._id === message.user?._id
                            && differenceInMinutes(
                                new Date(message._creationTime),
                                new Date(prevMessage._creationTime)
                            ) < TIME_THRESHOLD;



                        return (

                            <Message
                                key={message._id}
                                id={message._id}
                                memberId={message.memberId}
                                authorImage={message.user.image}
                                authorName={message.user.name}
                                reactions={message.reactions}
                                body={message.body}
                                image={message.image}
                                updatedAt={message.updatedAt}
                                createdAt={message._creationTime}

                                threadCount={message.threadCount}
                                threadImage={message.threadImage}
                                threadTimeStamp={message.threadTimeStamp}

                                isEditing={false}
                                setEditingId={() => { }}
                                isCompact={isCompact}
                                hideThreadButton={false}
                                isAuthor={false}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
    )
}