const mongoose = require('mongoose')

mongoose
   .connect("mongodb://localhost:27017/User")
   .then(() => console.log("connect to User"))
   .catch(() => console.log("cant connect to User"))

   const userSchema = new mongoose.Schema({
    phoneNumber : {type: String, unique: true},
    codeGift : {type: [String], default: [] },
    cash: Number,
    codeDavat: {type: String, unique: true}
    
   })

   const User = mongoose.model('user', userSchema)

   exports.getAllUser = async (req,res) => {
    try {
        res.json({
          data: await User.find()
        })
    } catch (error) {
        res.json({
         massage: "you have err"
        })
    }
   }

   exports.getOneUser = async (req,res) => {
      try {
           const user = await User.findById(req.params.id)
           if (!user) {
            return res.json({massage: "cant find user"})
           }

          res.json({
            data: user
          })
      } catch (error) {
          res.json({
           massage: "you have err"
          })
      }
     }

     exports.postUser = async (req,res) => {
      try {
         const {numer, code, codeDavat} = req.body
         
         const findNumber = await User.findOne({numer})
         if (findNumber) {
            return res.json({ massage : "number is in database"})
         }

         const findCodeDavat = await User.findOne({codeDavat})
         if (findCodeDavat) {
            
            const update = await User.findByIdAndUpdate(
                findCodeDavat._id,
                { $set: updatedData },
                { new: true }
              );
         }
         
         
      } catch (error) {
          res.json({
           massage: "you have err"
          })
      }
     }

     