import mongoose from "mongoose";

//Schema is like the table and its properties
const userSchema = new mongoose.Schema({
    
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    
    displayname: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    password:{
        type:  mongoose.Schema.Types.String,
        required: true,
    }
});

//The model is how you access that User table
export const User = mongoose.model("User", userSchema);
