const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User');

const protect = asyncHandler(async(req,res,next)=>{
    let token;

    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401)
        throw new Error("Not authorized, token missing");
    }

    token = authHeader.split(" ")[1]
    
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        res.status(401);
        throw new Error("Invalid or expired token");
    }    
    const user = await User.findById(decoded.id).select("-password")
    if(!user){
        res.status(401)
        throw new Error("user no longer exists");
    }
    req.user = user

    next()
})

module.exports = { protect }