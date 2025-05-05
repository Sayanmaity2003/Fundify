import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async()=>{
    const user = await currentUser(); //check the existence of the user in "clerk"
    if(!user){
        return null;
    }

    try{
        //Check the existence of the user in the database "supabase"
        const loggedInUser = await db.user.findUnique({
            where:{
                clerkUserId: user.id,
            }
        }); 

        if(loggedInUser){ //If user exist? login the user
            return loggedInUser;
        }

        //If user not exist then create a new user and insert it in the database
        const name = `${user.firstName} ${user.lastName}`;
        const newUser = await db.user.create({
            data:{
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
            },
        });
        return newUser;
    }catch(e){
        console.log(e.message);
    }
}