const mongoose = require('mongoose');

mongoose
   .connect("mongodb://localhost:27017/Savecode")
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.log("Error connecting to MongoDB:", error));

const adminSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true },
});

const Admin = mongoose.model('admin', adminSchema);

exports.getAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching admins",
      error: error.message
    });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const phoneNumber = req.params.number; // دریافت شماره تلفن از پارامتر URL
    const admin = await Admin.findOne({ phoneNumber });

    if (admin) {
      return res.json({ message: "Admin is already in database" });
    }

    const newAdmin = new Admin({
      phoneNumber: phoneNumber // شماره تلفن دریافتی
    });

    const result = await newAdmin.save();

    res.status(201).json({
      message: "Admin added successfully",
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: "Error adding admin",
      error: error.message
    });
  }
};
