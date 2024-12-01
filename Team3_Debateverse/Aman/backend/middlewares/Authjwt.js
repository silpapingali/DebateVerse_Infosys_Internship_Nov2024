const jwt= require('jsonwebtoken');

const Authjwt= (req, res, next)=>{
    const token= req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message: "Session expired ! Pleaes login again from fun"})
        }
        req.user= decoded;
        console.log(req.user);
        next();
    });
}

module.exports={Authjwt};