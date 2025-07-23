const express = require('express');
const app = express();

const {adminAuth} = require('./middleware/adminAuth');

// app.use('/admin', adminAuth);

app.get("/admin/addUser", adminAuth, (req, res, next) => {
  res.send('added the user');
});

app.get("/admin/deleteUser", (req, res) => {
  res.send('deleted the user');
});

app.use("/user",
  (req, res, next) => {
    console.log('console the 1st response!');
    next();
  },
  (req, res, next) => {
    res.send('2nd response!');
    next();
  },
  (req, res, next) => {
    // res.send('3rd response!')
    next();
  }
);

app.use("/getAllUser",(req,res,next)=>{
    throw new Error("QWERTY");
})
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(501).send('something went wrong!');
    }
})

app.listen(3000, () => {
  console.log('server listening on port 3000');
});