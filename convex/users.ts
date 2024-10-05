import { auth } from "./auth";
import {query } from "./_generated/server"
import { getAuthSessionId } from "@convex-dev/auth/server";


const current = query({
    args: {},
    handler: async (ctx) =>{
        const userId = await auth.getUserId(ctx); // deprecated
        // const userId = await getAuthSessionId(ctx);

        if(userId === null){
            return null;
        }

        return await ctx.db.get(userId);
    }
})

export default current