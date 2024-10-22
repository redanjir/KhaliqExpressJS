import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./strategies/local-strategy.mjs";
// import "./strategies/discord-strategy.mjs";
import MongoStore from "connect-mongo";
import connectDb  from "./config/dbConnection.mjs";

const app = express();
dotenv.config();
connectDb();


app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
    secret: "supersecret", 
    saveUninitialized: false, // Only saves the session to the db when its been modified e.g: when passport adding user id
    resave: false, // forces the cookie to update when u restart the session
    cookie:{maxAge: 70000 * 60},
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const PORT = process.env.PORT || 3000;


app.get("/api/auth/discord", passport.authenticate("discord"));

app.get("/api/auth/discord/redirect", passport.authenticate("discord"), (req,res) =>{
    res.sendStatus(200);
});

//Testing comment
app.post("/api/auth", passport.authenticate("local"), (req, res)=>{
    res.sendStatus(200);
});

app.get("/api/auth/status", (req, res)=>{
    console.log("Inside status");
    console.log(req.sessionID);
    if(!req.user){
        return res.sendStatus(401);
    }

    res.send(req.user);
});

app.post("/api/auth/logout", (req, res) =>{
    if(!req.user){
        return res.sendStatus(401);
    }

    req.logout((err) =>{
        if(err){
            return res.sendStatus(400);
        }
    });

    res.sendStatus(200);
})

app.get("/", (req, res)=>{
    req.session.visited = true;
    res.cookie("hello", "world", {maxAge: 60000 * 60, signed: true})
    res.status(201).send({msg: "hello world"});
});

app.listen(PORT, (err) =>{
    if(err){throw err}
    console.log(`Running on Port ${PORT}`);
});


