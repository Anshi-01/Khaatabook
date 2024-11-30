const hisaabModel= require("../models/hisaabModel")
const userModel= require("../models/userModel")


module.exports.showHisaabController=function(req,res){
    res.render("create");
}
module.exports.createHisaabController=async function(req,res){
    let { title,description,editeable,shareable,encrypted,passcode} = req.body;
     
    encrypted= encrypted === "on" ? true : false;
    shareable= shareable === "on" ? true : false;
    editeable= editeable === "on" ? true : false;

   let hisaabCreated= await hisaabModel.create({
        title,
        data : description,
        encrypted,
        shareable,
        editeable,
        passcode,
        user : req.user._id
    })
   
    let user= await userModel.findOne({ email: req.user.email})
    user.hisaabs.push(hisaabCreated._id);
    await user.save();

 res.redirect("/profile")
}

// View a hisaab
module.exports.viewHisaabController = async (req, res) => {
    const hisaabId = req.params.id;
    const hisaab = await hisaabModel.findById(hisaabId);
    if (!hisaab) {
        return res.status(404).send("Hisaab not found");
    }
    res.render("hisaab", { hisaab });
};

// Edit a hisaab
module.exports.editHisaabController = async (req, res) => {
    const hisaabId = req.params.id;
    const hisaab = await hisaabModel.findById(hisaabId);
    if (!hisaab) {
        return res.status(404).send("Hisaab not found");
    }
    res.render("editHisaab", { hisaab });
};

// Delete a hisaab
module.exports.deleteHisaabController = async (req, res) => {
    const hisaabId = req.params.id;
    await hisaabModel.findByIdAndDelete(hisaabId);
    res.redirect("/profile"); // Redirect after deletion
};
