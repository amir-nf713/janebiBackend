const mongoose = require('mongoose')


mongoose
  .connect("mongodb://mongodb:27017/Savecode")
  .then(() => console.log("connected to savecode"))
  .catch((err) => console.error("cant connected to savecode", err));




const stayincall = new mongoose.Schema({
    number: String,
    onvan: String,
    tozih: String,
    shenase: String,
})

const Stayincall = mongoose.model('stayincall', stayincall)

exports.getallstayincall = async (req, res) => {
    try {
        const data = await Stayincall.find().sort({ _id: -1 }); // مرتب‌سازی بر اساس ObjectId برای جدیدترین‌ها
        res.status(200).json({ data });
    } catch (error) {
        console.error(error); // برای دیباگ کردن خطا در کنسول
        res.status(500).json({
            message: "An error occurred while fetching data.",
            error: error.message
        });
    }
};

exports.postallstayincall = async (req,res) => {
    try {
        const {number, onvan, tozih} = req.body
        if (!number || !onvan || !tozih) {
            return res.json({massage : "data cant empty"})
        }

        const newMessage = new Stayincall({
           number : number,
           onvan : onvan,
           tozih : tozih,
           shenase : await Stayincall.countDocuments() + 9876
        })

        const result = await newMessage.save()
        res.json({
            data: result
        })


    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}

exports.deletestayincall = async (req,res) => {
    try {
        const shenase = req.params.shenase
       const find = await Stayincall.findOne({shenase})
       if (!find) {
        return res.json({message: "data cant find"})
       }

       const delate = await Stayincall.deleteOne({shenase})
       res.json({delate})
    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}