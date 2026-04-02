import mongoose from "mongoose";
 
export const connectdb = async() => {
    try {
        await mongoose.connect(process.env.mongo_Pass);
        console.log("connected Succesfful");
}
    catch (error) {
        console.log("error connectiing to the db" , error);
        process.exit(1);
    }
};
