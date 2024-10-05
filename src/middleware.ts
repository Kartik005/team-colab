import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";

//all public routes declared below          \/
const isPublicPage = createRouteMatcher(["/auth"])

// here we are providing an extended behaviour to "convexAuthNextjsMiddleware", not overwriting this module 
export default convexAuthNextjsMiddleware( (request) => {
    if(!isPublicPage(request) && !isAuthenticatedNextjs()){
        // if we try to go on an unauthorized page, we are redirected to the sign in page
        return nextjsMiddlewareRedirect(request, "/auth");
    }

    if(isPublicPage(request) && isAuthenticatedNextjs()){
        // redirect to home page
        return nextjsMiddlewareRedirect(request, "/"); 
    }
    // redirect away from /auth when authenticated
}

);

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};