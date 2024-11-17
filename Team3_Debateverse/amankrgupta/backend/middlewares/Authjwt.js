const jwt= require('jsonwebtoken');

const Authjwt= (req, res, next)=>{
    console.log(req.headers);
    const token= req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            return res.status(403).json({message: "Session expired ! Pleaes login again"})
        }
        req.user= decoded;
        next();
    });
}

module.exports={Authjwt};