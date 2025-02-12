const mongoose = require('mongoose')




mongoose
   .connect("mongodb://localhost:27017/Webinformation")
   .then(()=> console.log("connected to Webinformation"))
   .catch(()=> console.log("cant connected to Webinformation"))



const web = new mongoose.Schema({
   instagram: String,
   telegram: String,
   wahtsapp: String,
   poshtibani: String,
   timeCall: String,
   monyDavat: Number
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
            monyDavat: 0
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

