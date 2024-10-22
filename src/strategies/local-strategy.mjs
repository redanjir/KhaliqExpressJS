import passport from "passport";
import {Strategy} from "passport-local";
import {User } from "../mongoose/schemas/user.mjs";
import mongoose from "mongoose";
import { comparePassword } from "../utils/helpers.mjs";

//Stores the user id in the session
passport.serializeUser((user, done)=>{
    //Pass in something that is unique to the user like the id
    console.log("Inside Serialize User");
    console.log(user);
    done(null, user.id);
});

//finds out who the user is from the db/array and stores in the req.user obj using the id from session -> from serializeUser
passport.deserializeUser(async (id, done)=>{
    console.log("Inside Deserializer");
    console.log(`Deserializing user ${id}`);
    try{
        //Check if the id is a valid objectid
        if(!mongoose.Types.ObjectId.isValid(id)){
          throw new Error("Invalid objectid")
        }

        const finduser = await User.findById((id));

        if(!finduser){
            throw new Error("User not found");
        }
        
        done(null, finduser);
       
    }catch(err){
        done(err, null);
    }
});

passport.use(
    new Strategy( async (username, password, done)=>{
        console.log(username);
        console.log(password);
        try{
            const finduser = await User.findOne({username});
            if(!finduser){
                throw new Error("User is not found");
            }

            if(!comparePassword(password, finduser.password)){
                throw new Error("Bad Credentials");
            }            

            //Done takes in an error and user. Here err is null if both user and & pass is correct.
            done(null, finduser);
        }
        catch (err){
            done(err, null);
        }
    })
);

export default passport;