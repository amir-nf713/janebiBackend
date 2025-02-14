const mongoose = require('mongoose')


mongoose
   .connect("mongodb://localhost:27017/stayincall")
   .then(()=> console.log("connected to stayincall"))
   .catch(()=> console.log("cant connected to stayincall"))



const stayincall = new mongoose.Schema({
    number: String,
    onvan: String,
    tozih: String,
    shenase: String,
})

const Stayincall = mongoose.model('stayincall', stayincall)

exports.getallstayincall = async (req,res) => {
    try {
        res.json({
            data: await Stayincall.find()
        })
    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}

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