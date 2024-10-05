import { v } from "convex/values";

import { auth } from "./auth";
import { mutation, query } from "./_generated/server";


const generateCode = () => {
    const code = Array.from(
        { length: 6 },
        () => "0123456789qwertyuiopasdfghjklzxcvbnm"[Math.floor(Math.random() * 36)]
    ).join("");

    return code;
}

// join using invite code
export const join = mutation({
    args: {
        joinCode: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const workspace = await ctx.db.get(args.workspaceId);

        if (!workspace) {
            throw new Error("Workspace doesn't exist");
        }

        if (args.joinCode.toLocaleLowerCase() !== workspace.joinCode) {
            throw new Error("Invalid join code");
        }

        const existingMember = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id",
                (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId),
            ).unique();

        if (existingMember) {
            throw new Error("Already a member");
        }

        await ctx.db.insert("members", {
            userId,
            workspaceId: workspace._id,
            role: "member",
        });

        return workspace._id;
    },
})

// generate new join code
export const newJoinCode = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id",
                (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId),
            ).unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        const joinCode = generateCode();

        // patch the join code
        await ctx.db.patch(args.workspaceId, { joinCode });

        return args.workspaceId;

    },
})

// mutations used to mutate(insert, del, update) the data 

// create new workspace
export const create = mutation({
    args: {
        name: v.string(),
    },

    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const joinCode = generateCode();

        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            userId,
            joinCode,
        });

        // if we are making the workspace, ofc we are the admin,
        //** pushing entry into members table
        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "admin"
        })

        // geeneral channel created for each instance
        await ctx.db.insert("channels", {
            name: "general",
            workspaceId,
        })

        return workspaceId;
    }
})


// api read method
export const get = query({
    args: {},
    // collects all the data from "workspaces" table when me make a query
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            // if no userId, nothing returned
            return [];
        }

        //to get all the workspaces the user is  a part of
        // search for userId in the members table
        const members = await ctx.db.query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId)).collect();

        // mapping to all the workspaces where user is a member
        const workspaceIds = members.map((member) => member.workspaceId);

        const workspaces = [];

        for (const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId);

            if (workspace) {
                workspaces.push(workspace);
            }
        }

        return workspaces;
    },

})

export const getInfoById = query({
    args: { id: v.id("workspaces") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id",
                (q) => q.eq("workspaceId", args.id).eq("userId", userId),
            ).unique();


        const workspace = await ctx.db.get(args.id);


        return {
            name : workspace?.name,
            isMember : !!member,
        }
    }
})

export const getById = query({
    args: { id: v.id("workspaces") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id",
                (q) => q.eq("workspaceId", args.id).eq("userId", userId),
            ).unique();

        if (!member) return null;

        return await ctx.db.get(args.id);
    }
})

export const update = mutation({
    args: {
        id: v.id("workspaces"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id",
                (q) => q.eq("workspaceId", args.id).eq("userId", userId),
            ).unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
        })

        return args.id;
    }
})


export const remove = mutation({
    args: {
        id: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id",
                (q) => q.eq("workspaceId", args.id).eq("userId", userId),
            ).unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        const [members] = await Promise.all([
            ctx.db
                .query("members")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
                .collect(),
        ])

        // delete all joined members 
        for (const member of members) {
            await ctx.db.delete(member._id);
        }

        // delete workspace
        await ctx.db.delete(args.id);

        return args.id;
    }
})
