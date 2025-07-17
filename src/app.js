const express = require('express');
const app = express();
app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.params);
    res.send("get the user details");
})
app.listen(3000,()=>{
    console.log("server listening port number 3000");
})