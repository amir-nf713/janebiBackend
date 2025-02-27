const mongoose = require('mongoose');

// اتصال به MongoDB با استفاده از گزینه‌های جدید
mongoose
  .connect("mongodb://localhost:27017/Savecode", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// تعریف اسکیمای ادمین
const adminSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true } // شماره تلفن باید منحصر به فرد باشد
});

// مدل ادمین
const Admin = mongoose.model('admin', adminSchema);

// گرفتن تمام ادمین‌ها از دیتابیس
exports.getAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({
      data: admins
    });
  } catch (error) {
    console.error("Error fetching admins:", error); // لاگ کردن خطا
    res.status(500).json({
      message: "There was an error fetching admins",
      error: error.message
    });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const phoneNumber = req.params.num
    const admins = await Admin.findOne({phoneNumber});
    if (!admins) {
      return res.json({ massage: "cant find admins" });
    }
    res.json({
      login: "true",
      data: admins
    });
  } catch (error) {
    console.error("Error fetching admins:", error); // لاگ کردن خطا
    res.status(500).json({
      message: "There was an error fetching admins",
      error: error.message
    });
  }
};

// اضافه کردن ادمین جدید به دیتابیس
exports.addAdmin = async (req, res) => {
  try {
    const phoneNumber = req.params.number; // گرفتن شماره تلفن از پارامتر URL
    console.log(`Received phone number: ${phoneNumber}`); // نمایش شماره تلفن دریافتی

    // بررسی اینکه آیا ادمین با این شماره تلفن قبلاً در دیتابیس موجود است یا نه
    const admin = await Admin.findOne({ phoneNumber });

    if (admin) {
      return res.json({ message: "Admin is already in the database" }); // اگر موجود باشد
    }

    // ایجاد یک ادمین جدید
    const newAdmin = new Admin({
      phoneNumber: phoneNumber // شماره تلفن را به مدل اضافه می‌کنیم
    });

    // ذخیره‌سازی ادمین جدید در دیتابیس
    const result = await newAdmin.save();
    console.log('Admin added successfully:', result); // نمایش نتیجه ذخیره‌سازی

    res.status(201).json({
      message: "Admin added successfully",
      data: result
    });

  } catch (error) {
    console.error("Error adding admin:", error); // نمایش خطای ذخیره‌سازی
    res.status(500).json({
      message: "Error adding admin",
      error: error.message
    });
  }
};

exports.getkeyAdmin = async (req, res) => {
  try {

    const key = "Alireza12380@@jhd"
    const keyOk = req.params.ky
    if (
       keyOk=== key
    ) {
      res.json({
      data: "ok"
    });
    }
    
    
  } catch (error) {
     res.json({m : "err"})
  }
};
