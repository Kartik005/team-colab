import { mutation } from "./_generated/server";

export const generatedUploadUrl = mutation({
    args: {},
    handler : async (ctx, args) =>{
        return await ctx.storage.generateUploadUrl();
    }
})

// now this can be used in a hook