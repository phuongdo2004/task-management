const User = require("../../models/user.model");
module.exports.requireAuth = async (req, res , next)=>{

    if(!req.headers.authorization){
        res.json({
            code: 400 , 
            message: "Vui lòng gửi kèm theo token "
        })
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    if( !token){
        res.json({
            code: 400 , 
            message:"Vui lòng gửi kèm theo token"
        })
        return ;
    }
    // tim user có token đó
    const user = await User.findOne({
        token: token , 
        deleted:false,
    });

    if( !user){
        res.json({
            code: 403 , 
            message:"Token không hợp lệ"
        });
        return ;
    }
req.tokenVerify = token;
req.user = user;
    next();
}