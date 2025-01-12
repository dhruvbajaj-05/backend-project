//Same thing but writing it in a different way with promises instead of try and catch
const asyncHandler = (requestHandler)=>{
    (req,res,next)=> {
        Promise.resolve(requestHandler(req,res, next)).catch((err)=> next(err))
    }
}














/*Either you can write it like this - This basically is called everytime you take info from
database. The (fn) out here is the fn passed from the database file which connects mongoose to mongodb

const asyncHandler = (fn)=> async(req,res,next)=>{
    try{
        await fn(req,res,next)
    }catch(error){
        res.status(err.code || 500).json({
            success:false,
            message: err.message
        })
    }    
}
*/ 