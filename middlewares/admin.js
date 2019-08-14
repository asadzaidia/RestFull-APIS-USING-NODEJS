function isAdmin(req,res,next){
 
        if(!req.user.isAdmin) {
            return res.status(403).send({
                success : false,
                message : 'access denied! not authorize for this action!'
            })
        }
        else{
            next();
        }
}
module.exports = isAdmin;