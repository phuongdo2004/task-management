const Task = require("../../models/task.model.js");
const md5 = require("md5");
const User = require("../../models/user.model.js");


module.exports.index = async (req , res)=>{
    // Loc theo trang thai
        const status = req.query.status;
const find = {
    deleted:false,
    $or:[
        {
            createdBy:req.user.id
        } , 
        {
            listUser:req.user.id
        }
    ]
};
if(status){
    find.status = status;
}
    // Het loc theo trang thai

    //Sap xep theo tieu chi
        const sort = {};
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        if( sortKey && sortValue){
            sort.sortKey = sortValue;


        }
    //Het sap xep theoo tieu chi
// tim kiem
if( req.query.keyword){
    const regex = new RegExp(req.query.keyword , "i");
    find.title = regex;
}
// neu vs nhieu tren 1 url nhieu req.query thi dung & de noi tiep
    const task = await Task.find(find).sort(sort);
    res.json(task);
}
//[GET] detail/:id
module.exports.detail = async (req, res)=>{
    try {
        const id  = req.params.id;
        const task = await Task.findOne({
           _id: id,
           deleted:false, 
        });
        res.json(task);


    } catch (error) {
        res.json({
            message:"error"
        })
    }


}
// Change-status

module.exports.changeStatus = async (req , res)=>{
    
    
    try {
        const id = req.params.id;
        const status = req.body.status;
      
        await Task.updateOne({
            _id:id,
            deleted:false,
        } , {
            status:status,
        })
        res.json({
            message:"Cập nhật trạng thái thahf công!"
        });
    } catch (error) {
        res.json({
            message :"Not Found",
        })
    }


}
// End Change-status


//changeMultiStatus
module.exports.changeMultiStatus = async (req , res)=>{
    try {
        const ids = req.body.ids;
        const status  = req.body.status;
        console.log(ids);
        const task = await Task.updateMany({
            _id:{ $in: ids}
        } , {
            status:status
        }) ;
            res.json({
                "message" : "Cập nhật trạng thái thành công"
            })

    } catch (error) {
        res.json({
            "message" :"Not Found"
        })
    }
}
// changeMultiStatus
//[post] create 
module.exports.create = async(req , res)=>{

    try {
        req.body.createdBy = req.user.id;
   
        const task = new Task(req.body);
        await task.save();
        res.json({
            message:"Tạo mới công việc thành công",
            task : task
        })
    } catch (error) {
        res.json({
            message:"Not Found"
        })
    }
}
module.exports.edit = async(req, res)=>{
    try {
    const id =  req.params.id;
    await Task.updateOne({
        _id: id,
        deleted:false,
    } ,req.body);
    res.json({
        message:"Cập nhật trạng thái thành công"
    })
} catch (error) {
    res.json({
        message: "Not Found"
    })
    
}


}
// [patch] tasks/deleted/:id
module.exports.delete = async(req , res)=>{
    try {
        const id = req.params.id;
        await Task.updateOne({
                _id:id,
        } , {
            deleted:true
        });
        res.json({
            message:"Cập nhật trạng thái thành công"
        })

    } catch (error) {
        res.json({
            message:"Not Found"
        })
    }
    


}

