import passport from "passport";
import { Strategy } from "passport-discord";
import { discordUser } from "../mongoose/schemas/discord-user.mjs";


//Stores the user id in the session
passport.serializeUser((user, done)=>{
    //Pass in something that is unique to the user like the id
    console.log("Inside Serialize User");
    console.log(user);
    done(null, user.id);
});

//reads the Id from the session and finds the user in the db
passport.deserializeUser(async (id,done) =>{
    try {
        const finduser = await discordUser.findById(id);

        if(!finduser){
            return done(null ,null)
        }

        return done(null, finduser)

    } catch (error) {
        done(error, null);
    }
})

export default passport.use(
    new Strategy(
        {
            clientID: '1294513268475433013',
            clientSecret: 'hD-sGSAqP-BMua0HjS6qCzIM0KLLmv45',
            callbackURL: 'http://localhost:3001/api/auth/discord/redirect',
            scope: ["identify", "email", "guilds" ],
        },
        async (accessToken, refreshToken, profile, done)=>{
            let findUser;
            try {
                findUser = await discordUser.findOne({discordId: profile.id}); 
            } catch (error) {
                return done(error, null);
            }

            try {
                if(!findUser){
                    const newUser = new discordUser({
                        username: profile.username,
                        discordId: profile.id,
                    });
                    const newSavedUser = await newUser.save();
                    return done(null, newSavedUser);
                }

                return done(null,findUser);
            } catch (error) {
                console.log(error);
                return done(error, null)
            }
           
        }
    )
);