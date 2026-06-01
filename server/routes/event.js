import express from "express";
const eventRouter = express.Router();

eventRouter.get("/api/dheeraj",function(req,res){
    res.send("hi at event api dheeraj")
})
export{eventRouter}