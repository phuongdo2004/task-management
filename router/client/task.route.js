const express = require("express");
const router = express.Router();
const cors = require("cors");

const controller = require("../../controller/client/home.controller")
router.get("/", controller.index);

router.get("/detail/:id", controller.detail);
router.patch("/change-status/:id" , controller.changeStatus);
// thay doi trang thai nhieu cong viec
router.patch("/change-status" , controller.changeMultiStatus);
// [post] create tasks
router.post("/create" , controller.create);
//[PATCH]edit task
router.patch("/edit/:id" , controller.edit);
//[PATCH] /tasks/deleted/:id
router.patch("/deleted/:id" , controller.delete);


module.exports = router;