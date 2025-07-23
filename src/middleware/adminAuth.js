const adminAuth = (req,res,next)=>{
    let auth = true;
    if(!auth){
        res.status(401).send('un auth');
    }
    else{
        next();
    }
}

module.exports = { adminAuth }