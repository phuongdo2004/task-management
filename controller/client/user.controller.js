const User = require("../../models/user.model");
const md5 = require("md5");
const generate = require("../../helpers/generate.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const sendEmailHelper = require("../../helpers/sendEmail.helper");

// [GET]/users
module.exports.index = async(req , res)=>{
    const users = await User.find({});
    res.json({
        user:users
    })


}

// [POST] /USER/REGISTER
module.exports.register = async(req , res)=>{

try {
    // xem email da ton tai chua
    const existUser = await User.findOne({
        email: req.body.email,
        deleted:false,
    });
    if( existUser){
        res.json({
          
            code:400 , message:"Email đã tồn tại!"
        });
        return ;
    }
        const password = md5(req.body.password);
        const token = generate.generateRandomString(30);
        const dataUser = {
            fullName : req.body.fullName , 
            email : req.body.email , 
            password:password ,
            token : token,
        };
        const user = new User(dataUser);
        await user.save();

        res.json({
            code:200 , 
            message : "Đăng kí thành công!",
            token: token
        });
} catch (error) {
    res.json({
        message : "Not Found"
    });

}


}
// [POST] users/login
module.exports.login = async(req, res)=>{
    console.log("oke");
    const existUser = await User.findOne({
        email: req.body.email , 
        deleted: false,
    });
    if( !existUser){
        res.json({
            code : 400 ,
            message:"Tài khoản không tồn tại!"
        })
        return ;
    }
    const password = md5(req.body.password);
   
    if( existUser.password == password){
        res.json({
            code: 200,
            message : "Đăng nhập thành công!"
        })
    }else{
        res.json({
            message:"Mật khẩu không đúng!"
        })
    }


}
//[POST]forgotPassword
module.exports.forgotPassword = async (req, res)=>{
    const email = req.body.email;
   //v1 check email va tao ma otp roi luu vao db
   const existEmail = await User.findOne({
        email : req.body.email,
        deleted: false,
   });
   if( !existEmail){
    res.json({
        code: 400 ,
        message :"Email không tồn taij trong hệ thống"

    });
    return;
   }
   // tao ra 1 opt 
   const otp = generate.generateRandomNumber(4);
   // luu vao db
   console.log(otp);
   const forgotPassword = new ForgotPassword({
    email : req.body.email,
    otp : otp,
    expireAt: Date.now()+ 3*60 *1000

   });
  await forgotPassword.save();
  // V2 gui otp qua email
  // Việc 2: Gửi mã OTP qua email của user
  const subject = "Mã OTP lấy lại mật khẩu.";
  const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác.`;
  sendEmailHelper.sendEmail(email, subject, htmlSendMail);

  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!"
  });
}

// nhap otp xac thuc
module.exports.otpPassword = async(req , res)=>{
    const otp = req.body.otp;
    const email = req.body.email;
    // kiem tra xem hop le ko 
    const existotp = await ForgotPassword.findOne({
        email : req.body.email,
        otp : otp ,
    });
    if(!existotp){
        res.json({
            code:200 , 
            message:"OTP không hợp lệ "
        });
        return;
    }
    const user = await User.findOne({
        email : email,

    });
    console.log(user);
    res.json({
        code:200 , 
        message : "Xác thực thành công!",
        // tra ra de no lien ket vs form sau
        token : user.token
    })



}
module.exports.resetPassword = async (req , res)=>{
    const token  = req.body.token ;
    const password = req.body.password;
    await User.updateOne({
        token : token ,
        deleted:false,
    } , {
        password: md5(password)

    })
    res.json({
        code:200 , 
        message : "Đổi mật khẩu thành công"
    });
}
//-password -token co nghia la ko lay 
module.exports.profile = async(req , res)=>{
    try {
        const user = await User.findOne({
            token: req.tokenVerify, 
            deleted:false
        }).select("-password -token");
        res.json({
            code: 200 , 
            message:"Thành công!" , 
            user : user
        })
    } catch (error) {
        res.json({
            code: 200 ,
            message :"User không tồn tại"
        })
    }
    

}