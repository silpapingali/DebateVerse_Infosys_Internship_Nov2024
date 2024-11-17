const jwt= require('jsonwebtoken');

const Authjwt= (req, res, next)=>{
    const token= req.headers.authorization;
    if(!token){
        return res.status(403).json({message: "Session expired ! Please login again"})
    }
    const decoded= jwt.verify(token, process.env.JWT_SECRET, (err)=>{
        return res.status(403).json({message: "Session expired ! Pleaes login again"})
    });
    req.user= decoded;
    next();
}

module.exports={Authjwt};