// import { RedirectToSignIn } from "@clerk/nextjs";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([ //This are protected routes, user needs to login to enter into this routes
    "/dashboard(.*)", //(.*) means /dashboard/abc or /dashboard/xyz etc...
    "/account(.*)",
    "/transaction(.*)",
])

export default clerkMiddleware( async (auth, req)=>{
    const {userId} = await auth(); //Get the userId of the loggedin user

    if(!userId && isProtectedRoute(req)){ //If user is not loggedin and want to access the protected routes then he will redirects to sign-in page
        const {redirectToSignIn} = await auth();
        return redirectToSignIn();
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};