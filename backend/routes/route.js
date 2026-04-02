import express from "express";

const router = express.Router();

router.get("/",  (req,res) => {
    res.status(200).send("this is a send method and get response");
});

router.post("/" , (req , res) => {
    res.status(201).json({message: "this is a post method and json response"});
});

router.put("/:id" , (req , res)  => {
    res.status(200).json({message: "this is put method and json response"});
});

router.delete("/:id" , (req , res)  => {
    res.status(200).json({message: "this is delete method and json response"});
});


export default router;

