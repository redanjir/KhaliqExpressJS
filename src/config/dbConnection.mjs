import mongoose from "mongoose";

const connectDb = async () =>
{
    try {
        await  mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.log(`Error :${error}`);
    }

};

export default connectDb;