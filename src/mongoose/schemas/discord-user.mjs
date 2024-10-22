import mongoose from "mongoose";

//Schema is like the table and its properties
const discordUserSchema = new mongoose.Schema({
    
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    discordId:{
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true,
    }
});

//The model is how you access that User table
export const discordUser = mongoose.model("discordUser", discordUserSchema);
