const asyncHandler = require('./asyncHandler')

const authorize = (...roles) => asyncHandler(async(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        res.status(403)
        throw new Error("access denied");
    }
    next()
})

module.exports = { authorize }