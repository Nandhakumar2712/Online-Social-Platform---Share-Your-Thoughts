import mongoose from "mongoose";
const db = new mongoose.Schema(
    {
        tittle : {
            type : string,  
            required : true,
        },
     content : {
        tyoe : string,
        required : true ,
     },  
    },
    {timestamps : true }

);

const Note = mongoose.model(db ,  "Note");

export default Note;