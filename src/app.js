const express = require('express');
const app = express();
app.use("/test",(req,res)=>{
    res.send('server listening for test page url');
})
app.use("/",(req,res)=>{
    res.send('server listening for home page url');
})
app.listen(3000,()=>{
    console.log("server listening port number 3000");
})