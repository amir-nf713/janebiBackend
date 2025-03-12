const mongoose = require('mongoose');
const { db } = require('../mongo');  // وارد کردن apiKey.db از فایل mongo.js




mongoose.connect(`mongodb://${db}/Savecode`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));


const web = new mongoose.Schema({
   instagram: String,
   telegram: String,
   wahtsapp: String,
   poshtibani: String,
   timeCall: String,
   monyDavat: Number,
   postMoney: Number
})

const Web = mongoose.model('web', web)


exports.getInformation = async (req,res) => {
    try {
        res.json({
            data: await Web.find()
        })
    } catch (error) {
        res.json({
            massage: "you have err"
        })
    }
}

exports.addInformation = async (req,res) => {
    try {

        const Cdoc = await Web.countDocuments()
        if (Cdoc >= 1) {
            return res.json({ massage : "data is in data base"})
        }
        const newWeb = new Web({
            instagram: "",
            telegram: "",
            wahtsapp: "",
            poshtibani: "",
            timeCall: "",
            monyDavat: 0,
            postMoney: 0
          })

          const result = await newWeb.save()

          res.json({ 
            data: result
        })


    } catch (error) {
        res.json({
            massage: "you have err"
        })
    }
}


exports.updateInformation = async (req,res) => {
    try {
      
      const webData = await Web.find()
    if (!webData) {
        return res.json({ massage: "web data cant find"})
    }
    
    

    const updatedData = req.body
    const Id = webData[0]._id

    const update = await Web.findByIdAndUpdate(
        Id,
        { $set: updatedData },
        { new: true }
      );

      res.json({update})


        
    } catch (error) {
        res.json({
            massage: "you have err" 
        })
    }
}

