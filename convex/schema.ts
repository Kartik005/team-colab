
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";

// schema  automaically adds the defined tables to our convex database

const schema = defineSchema({
    // convex automatically uploads the tables provided in schema
    ...authTables,

    // workspaces of user
    workspaces: defineTable({
        name: v.string(),
        userId: v.id("users"),
        joinCode: v.string(),
    }),

    // members of a workspace
    members: defineTable({
        userId: v.id("users"),
        workspaceId: v.id("workspaces"),
        role: v.union(v.literal("admin"), v.literal("member"))
    })
        .index("by_user_id", ["userId"])
        .index("by_workspace_id", ["workspaceId"])
        .index("by_workspace_id_user_id", ["workspaceId", "userId"]),

    // channels of a workspace
    channels: defineTable({
        name: v.string(),
        workspaceId: v.id("workspaces"),
    })
    .index("by_workspace_id", ["workspaceId"]),
    
    // conversations between 2 members
    conversations: defineTable({
        workspaceId: v.id("workspaces"),
        memberOneId: v.id("members"),
        memberTwoId: v.id("members"),
    })
    .index("by_workspace_id", ["workspaceId"]),

    //messages stored in backend among users, we store the date, time and id of user
    messages: defineTable({
        body: v.string(),
        image: v.optional(v.id("_storage")),
        memberId : v.id("members"), // map message to members in the channel
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")), //optional cuz  texts also be dms
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
        updatedAt: v.optional(v.number()),
    })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id_parent_message_id_conversation_id", ["channelId", "parentMessageId", "conversationId"]),

    reactions: defineTable({
        workspaceId: v.id("workspaces"),
        messageId: v.id("messages"),
        memberId : v.id("members"), // map message to members in the channel
        value: v.string(),
    })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"])
    
    

})

export default schema;