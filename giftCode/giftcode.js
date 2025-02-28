const mongoose = require("mongoose");

mongoose.connect('mongodb://mongodb:27017/Savecode', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));


const giftCode = new mongoose.Schema({
  code: String,
  money: Number
});

const GiftCode = mongoose.model("giftCode", giftCode);


exports.getcode = async (req, res) => {
    try {
        res.json({
          data: await GiftCode.find(),
        });
      } catch (error) {
        res.json({
          massage: "you have err",
        });
      }
}



exports.postcode = async (req, res) => {
    try {
       const {code, time, money} = req.body
       if (!code || !time || !money) {
         return res.json({messagr: "data cant empty"})
       }

       const find = await GiftCode.findOne({code})
       if (find) {
         return res.json({messag: "data is avelable"})
       }

       const newGifcod = new GiftCode({
          code : code,
          money: money
       })

       const result = await newGifcod.save()

       const _id = result._id
       const Time = time*24*60*60*1000

       setInterval(async () => {

        const find = await GiftCode.findOne({_id})
        if (!find) {
            return res.json({messag: "data cant find"})
        }

          const deleteGif = await GiftCode.deleteOne({_id})

          

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
      const find = await GiftCode.findOne({_id})
      if (!find) {
          return res.json({messag: "data cant find"})
      }

        const deleteGif = await GiftCode.deleteOne({_id})
        res.json({
          data : deleteGif
        })
    } catch (error) {
      res.json({
        massage: "you have err",
      });
    }
}