const mongoose = require("mongoose");
const { db } = require('../mongo');  // وارد کردن apiKey.db از فایل mongo.js

mongoose.connect(`mongodb://${db}/Savecode`)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));
const offercode = new mongoose.Schema({
  code: String,
  money: Number,
  maxShope: Number
});

const Offercode = mongoose.model("offercode", offercode);


exports.getcode = async (req, res) => {
    try {
        res.json({
          data: await Offercode.find(),
        });
      } catch (error) {
        res.json({
          massage: "you have err",
        });
      }
}



exports.postcode = async (req, res) => {
    try {
       const {code, time, money, maxShope} = req.body
       if (!code || !time || !money || !maxShope) {
         return res.json({messagr: "data cant empty"})
       }

       const find = await Offercode.findOne({code})
       if (find) {
         return res.json({messag: "data is avelable"})
       }

       const newoffercod = new Offercode({
          code : code,
          money: money,
          maxShope: maxShope
       })

       const result = await newoffercod.save()

       const _id = result._id
       const Time = time*24*60*60*1000

       setInterval(async () => {

        const find = await Offercode.findOne({_id})
        if (!find) {
            return res.json({messag: "data cant find"})
        }

          const deleteoffer = await Offercode.deleteOne({_id})

          

       }, Time);

          res.json({
            data: result
          })

      } catch (error) {
        res.json({
          massage: "you have err",
        });
      }
}


exports.deleteGif = async (req, res) => {
    try {

      const _id = req.params.id
      const find = await Offercode.findOne({_id})
      if (!find) {
          return res.json({messag: "data cant find"})
      }

        const deleteoffer = await Offercode.deleteOne({_id})
        res.json({
          data : deleteoffer
        })
    } catch (error) {
        res.json({
            massage: "you have err",
          });
    }
}