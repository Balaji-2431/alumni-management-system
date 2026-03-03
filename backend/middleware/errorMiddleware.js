// const errorHandler = (err,req,res,next)=>{
//     const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500 ;

//     res.status(statusCode).json({
//         success :false,
//         message: err.message || "server error",
//     })
// }

// module.exports = errorHandler;

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  console.error("🔥 ERROR:");
  console.error(err.stack); // THIS is what you need

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = errorHandler;