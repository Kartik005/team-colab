// api for messages create, update and delete functionality
import { v } from "convex/values"
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { count, timeStamp } from "console";
import { paginationOptsValidator } from "convex/server";


const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    // load all messages that are replies to "messageId"
    const messages = await ctx.db.query("messages")
        .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId)).collect();

    if (messages.length === 0) {
        return {
            count: 0,
            image: undefined,
            timeStamp: 0,
        }
    }

    const lastMessage = messages[messages.length - 1];
    const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

    if (!lastMessageMember) {
        return {
            count: 0,
            image: undefined,
            timeStamp: 0,
        }
    }

    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

    return {
        count: messages.length,
        image: lastMessageUser?.image,
        timeStamp: lastMessage._creationTime,
    }

}

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
    return ctx.db.query("reactions")
        .withIndex("by_message_id",
            (q) => q.eq("messageId", messageId)).collect();
}

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId);
}

export const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId);
}

// find member by workspace and userid
const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">) => {

    return ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", workspaceId).eq("userId", userId),
        )
        .unique();
}

export const get = query({
    args: {
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator, // to load only pages of replies, instead of the whole thread

    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized access");
        }
        let _conversationId = args.conversationId;

        if (!args.conversationId && !args.channelId && args.parentMessageId) {

            const parentMessage = await ctx.db.get(args.parentMessageId); // find parent message in "messages" database

            if (!parentMessage) {
                throw new Error("Message not found!");
            }

            _conversationId = parentMessage.conversationId;
        }

        const results = await ctx.db.query("messages")
            .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
                q.eq("channelId", args.channelId)
                    .eq("parentMessageId", args.parentMessageId)
                    .eq("conversationId", _conversationId))
            .order("desc")
            .paginate(args.paginationOpts);

        return {
            ...results,
            page: (
                await Promise.all(
                    results.page.map(async (message) => {
                        const member = await populateMember(ctx, message.memberId);
                        const user = member ? await populateUser(ctx, member.userId) : null;

                        if (!member || !user) {
                            return null;
                        }

                        const reactions = await populateReactions(ctx, message._id);
                        const thread = await populateThread(ctx, message._id);

                        const image = message.image
                            ? await ctx.storage.getUrl(message.image)
                            : undefined;

                        const reactionsWithCounts = reactions.map((reaction) => {
                            return {
                                ...reaction,
                                count: reactions.filter((r) => r.value === reaction.value).length,
                            };
                        });

                        const dedupedReaction = reactionsWithCounts.reduce(
                            (acc, reaction) => {
                                const existingReaction = acc.find(
                                    (r) => r.value === reaction.value,
                                );

                                if (existingReaction) {
                                    existingReaction.memberIds = Array.from(
                                        new Set([...existingReaction.memberIds, reaction.memberId])
                                    );
                                }
                                else {
                                    acc.push({ ...reaction, memberIds: [reaction.memberId] });
                                }
                                return acc;
                            },
                            [] as (Doc<"reactions"> & {
                                count: number;
                                memberIds: Id<"members">[];
                            })[]
                        );

                        const reactionsWithoutMemberIdProperty = dedupedReaction.map(
                            ({ memberId, ...rest }) => rest,
                        );

                        return {
                            ...message,
                            image,
                            member,
                            user,
                            reactions: reactionsWithoutMemberIdProperty,
                            threadCount: thread.count,
                            threadImage: thread.image,
                            threadTimeStamp: thread.timeStamp,
                        };
                    })
                )
            ).filter( (message) => message !== null)
        }

        //

    }
})


export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")), // texts b/w channels and can also be dms
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
        // add conversation Id
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await getMember(ctx, args.workspaceId, userId);
        if (!member) {
            throw new Error("Unauthorized");
        }

        let _conversationId = args.conversationId;

        if (!args.conversationId && !args.channelId && args.parentMessageId) {

            const parentMessage = await ctx.db.get(args.parentMessageId); // find parent message in "messages" database

            if (!parentMessage) {
                throw new Error("Message not found!");
            }

            _conversationId = parentMessage.conversationId;
        }



        // mutation returns the id of the insert query
        const messageId = await ctx.db.insert("messages", {
            body: args.body,
            image: args.image,
            channelId: args.channelId,
            parentMessageId: args.parentMessageId,
            workspaceId: args.workspaceId,
            conversationId: _conversationId,
            memberId: member._id,
        })

        return messageId;
    },
})