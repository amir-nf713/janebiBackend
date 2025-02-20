const mongoose = require('mongoose')


mongoose
   .connect("mongodb://localhost:27017/Savecode")
   .then(()=> console.log("connected to kala"))
   .catch(()=> console.log("cant connected to kala"))



const kala = new mongoose.Schema({
   onvan: String,
   categori: String,
   berand: String,
   color: {type: Array, default: []},
   money: Number,
   offer: Number,
   tozih: {type: Array, default: []},
   photo: String,
   smallTozih: String,
   devaiceOK: {type: Array, default: []},
   garanti: String,
   star: Number,
   nazarat: {type: Array, default: []},
   tagSearch: {type: Array, default: []},
   shenase: Number
})

const Kala = mongoose.model('kala', kala) 

exports.getkala = async (req,res) =>{
    try {
        res.json({
           data: await Kala.find()
        })
    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}


exports.postkala = async (req,res) =>{
    try {
          const {onvan, categori, berand, color, money, offer, tozih, photo, smallTozih, devaiceOK, garanti, tagSearch} = req.body 
          
          if (!onvan || !categori || !berand || !color || !money || !offer || !tozih || !photo || !smallTozih || !devaiceOK || !garanti || !tagSearch) {
            return res.json({massage: "data cant empty"})
          }

          const newKala = new Kala({
              onvan : onvan,
              categori : categori,
              berand : berand,
              color : color,
              money : money,
              offer : offer,
              tozih : tozih,
              photo : photo,
              smallTozih : smallTozih,
              devaiceOK : devaiceOK,
              garanti : garanti,
              star : 5,
              nazarat : [],
              tagSearch : tagSearch,
              shenase : await Kala.countDocuments() + 687

          })

          const result = await newKala.save()

          res.json({
            data: result
          })




    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}


exports.putkala = async (req,res) =>{
    try {
        const shenase = req.params.shenase

        const findKala = await Kala.findOne({ shenase })
        if (!findKala) {
         return res.json({message: "cant find kala"})
        }
     
        const updatedData = req.body;
        const Id = findKala._id;
     
        const update = await Kala.findByIdAndUpdate(
          Id,
          { $set: updatedData },
          { new: true }
        );
     
        res.json({ update });
     
    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}


exports.deletkala = async (req,res) =>{
    try {
        const shenase = req.params.shenase

        const findKala = await Kala.findOne({ shenase })
        if (!findKala) {
         return res.json({message: "cant find kala"})
        }
     
    
        const deleteKala = await Kala.deleteOne({ shenase });
    
        res.json({
          data: deleteKala,
        });
    } catch (error) {
        res.json({
            massage: "you have err"
        })   
    }
}