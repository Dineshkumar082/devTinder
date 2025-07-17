const express = require('express');
const app = express();
//order of the routes matters a lot.
//also app.use handle all http request if u want specific use app.get,app.post etc.,
// app.use("/test/h2",(req,res)=>{
//     res.send('server listening for test-h2 page url');
// })
// app.use("/test",(req,res)=>{
//     res.send('server listening for test page url');
// })
// app.use("/",(req,res)=>{
//     res.send('server listening for home page url');
// })
//if app.use use in top below routes not working properly because orders matters a lot
//app.use("/user",(req,res)=>{res.send("HAHAHAHA")}) all get and post request response is hahahaha only :)
app.get("/user",(req,res)=>{
    res.send({
        firstname:"Dinesh",
        lastname:"kumar"
    })
})
app.post("/user",(req,res)=>{
    //save the user details to DB
    res.send("user data saved to the DB succefully!");
})
app.listen(3000,()=>{
    console.log("server listening port number 3000");
})