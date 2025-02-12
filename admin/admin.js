const mongoose = require('mongoose')

mongoose
   .connect("mongodb://localhost:27017/Admin")
   .then(() => console.log("connect to Admin"))
   .catch(() => console.log("cant connect to Admin"))

   const adminSchema = new mongoose.Schema({
      phoneNumber : {type: String, unique: true},
    })

   const Admin = mongoose.model('admin', adminSchema)

   exports.getAdmin = async (req,res) => {
         try {
            res.json({
                data : await Admin.find()
            })
         } catch (error) {
            res.json({
                massage: "you have err"
            })
         }
    }

    exports.addAdmin = async (req,res) => {
        try {
          const addAdmin = req.params.number
          const admin = await Admin.findOne({addAdmin})
          if (admin) {
            return res.json({massage: "admin is in database"})
          }
          const newAdmin = new Admin({
            phoneNumber: addAdmin
          })

          const result = await newAdmin.save()

          res.json({ data: result})
           

        } catch (error) {
           res.json({
               massage: "you have err"
           })
        }
   }