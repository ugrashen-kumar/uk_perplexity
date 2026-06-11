import jwt from 'jsonwebtoken'

export const authUser = async(req, res, next) =>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            Message : "Unauthorized",
            success : false,
            err : "No Token Provided"
        })
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    
        req.user = decoded
        next()
    }catch(error){
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }

}