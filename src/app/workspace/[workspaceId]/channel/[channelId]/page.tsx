"use client"

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id"
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";

const ChannelIdPage = () => {

  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({ channelId });


  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-4 items-center justify-center">
        <TriangleAlert className="size-4  text-muted-foreground" />
        <span className="text-muted-foreground">Channel not found</span>
      </div>
    )
  }

  return (
    <>
      <div className="bg-[#F2E5BF] flex flex-col h-full">
        <Header name={channel.name} />
      
        <MessageList
          channelName = {channel.name}
          channelCreationTIme = {channel._creationTime}
          data={results}
          loadMore = {loadMore}
          isLoadingMore = {status === "LoadingMore"}
          canLoadMore = {status === "CanLoadMore"}
        />
        <ChatInput placeholder={`Message # ${channel.name}`} />
      </div>
      {/* <div>ChannelIdPage {params.workspaceId}  </div>
      <div>ChannelIdPage {params.channelId}  </div> */}
    </>
  )
}

export default ChannelIdPage