const mongoose = require('mongoose')


mongoose
   .connect("mongodb://localhost:27017/Savecode")
   .then(()=> console.log("connected to Catergori"))
   .catch(()=> console.log("cant connected to Catergori"))



const categori = new mongoose.Schema({
   picture : String,
   onvan : String,
   shenase: String
})

const Catergori = mongoose.model('categori', categori)


exports.getcategori = async (req,res) => {
    try {
        res.json({
            data : await Catergori.find()
        })
    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}

exports.postcategori = async (req, res) => {
    try {
        const {picture, onvan} = req.body
        const shenase = await Catergori.countDocuments() + 9786
         
        const caategori = new Catergori({
            picture: picture,
            onvan: onvan,
            shenase: shenase
        })

        const result = await caategori.save()

        res.json({
            data: result
        })

    } catch (error) {
        res.json({
            massage: "you have err"
        })  
    }
}

exports.deletecategori = async (req,res) => {
    try {
        const _id = req.params.id
        const findCategori = await Catergori.findOne({ _id })
        if (!findCategori) {
          return res.json({ massage : "cant find categori"})   
        }

        const deletecategori = await Catergori.deleteOne({ _id })
        res.json({
            data: deletecategori
        })



    } catch (error) {
        res.json({
            massage: "you have err"
        }) 
    }
}