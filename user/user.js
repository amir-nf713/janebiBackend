const soap = require("soap");
const wsdlUrl = "http://87.248.137.75/webservice/send.php?wsdl";
const { default: axios } = require("axios");
const mongoose = require("mongoose");
const { default: apiKey } = require("../mongo");

mongoose.connect(`mongodb://${apiKey.db}/Savecode`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true },
  Name: String,
  codeGift: { type: [String], default: [] },
  cash: { type: Number, default: 0 },
  codeDavat: String 
});

const User = mongoose.model("user", userSchema);

exports.getAllUser = async (req, res) => {
  try {
    res.json({
      data: await User.find(),
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const phoneNumber = req.params.num;
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.json({ massage: "cant find user" });
    }

    res.json({
      login: "true",
      data: user
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};


exports.getOneUserId = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.json({ massage: "cant find user" });
    }

    res.json({
      login: "true",
      data: user
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.postUser = async (req, res) => {
  try {
    const { number, code, codeDavat } = req.body;

    const findNumber = await User.findOne({ number });
    if (findNumber) {
      return res.json({ message: "number is in database" });
    }

    const findCodeDavat = await User.findOne({ codeDavat });
    if (findCodeDavat) {
      try {
        const response = await axios.get("http://localhost:3001/api/webdata/");
        const addMoney = response.data.data[0].monyDavat;
        findCodeDavat.cash += addMoney;
        await findCodeDavat.save(); // ذخیره تغییرات
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }

    if (code === "") {
      return res.json({ message: "code can't be empty" });
    }

    if (number === "") {
      return res.json({ message: "number can't be empty" });
    }

    const saveUser = new User({
      phoneNumber: number,
      codeDavat: await User.countDocuments() + 1000,
      codeGift: [],
      Name: "",
      cash: 0,
    });

    const result = await saveUser.save();
    res.json({
      data: result,
    });
  } catch (error) {
    console.error(error);
    
    res.json({
      
      
      massage: "you have err",
    });
  }
};

exports.updateCash = async (req, res) => {
  try {
    const { phoneNumber, cash } = req.body;

    // پیدا کردن کاربر بر اساس شماره تلفن
    const findUser = await User.findOne({ phoneNumber });
    console.log(findUser);

    if (!findUser) {
      return res.json({ message: "user not found" }); // استفاده از return برای جلوگیری از ادامه اجرای کد
    }

    // بررسی اینکه موجودی ورودی منفی نباشد (اگر نیاز به این بررسی دارید)
    if (cash < 0) {
      return res.json({ message: "cash can't be negative" });
    }

    // افزودن موجودی جدید به حساب کاربر
    findUser.cash += cash;
    await findUser.save(); // ذخیره تغییرات

    // ارسال پاسخ با اطلاعات به‌روزرسانی شده
    res.json({
      data: findUser,
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.updateCodeGift = async (req, res) => {
  try {
    const { phoneNumber, offerCode } = req.body;

    // پیدا کردن کاربر بر اساس شماره تلفن
    const findUser = await User.findOne({ phoneNumber });
    if (!findUser) {
      return res.json({ message: "user not found" }); // استفاده از return برای جلوگیری از ادامه اجرای کد
    }

    // اضافه کردن کد هدیه به لیست codeGift
    findUser.codeGift.push(offerCode);

    // ذخیره تغییرات در پایگاه داده
    await findUser.save();

    // ارسال پاسخ با اطلاعات به‌روزرسانی شده
    res.json({
      data: findUser,
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const findUser = await User.findOne({ _id });
    if (!findUser) {
      return res.json({ massage: "user not found" });
    }

    const updatedData = req.body;
    const Id = findUser._id;

    const update = await User.findByIdAndUpdate(
      Id,
      { $set: updatedData },
      { new: true }
    );

    res.json({ update });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const phoneNumber = req.params.num;
    const findUser = await User.findOne({ phoneNumber });
    if (!findUser) {
      return res.json({ massage: "user not found" });
    }

    const deleteUser = await User.deleteOne({ phoneNumber });

    res.json({
      data: deleteUser,
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { value, message } = req.body;

    // بررسی مقادیر ورودی
    if (!value || !message) {
      return res.json({ message: "data can't be empty" });
    }

    if (value <= 0) {
      return res.json({ message: "Can't lower than 1" });
    }

    // انتخاب تصادفی کاربران
    const randomUsers = await User.aggregate([
      { $sample: { size: value } },
      { $project: { _id: 0, phoneNumber: 1 } },
    ]);

    // ساخت آرایه‌ای از شماره‌های تلفن کاربران تصادفی
    const alluser = randomUsers.map((data) => data.phoneNumber);
    // console.log(alluser);

    // اطلاعات ارسال پیام
    const sendSmsInformation = {
      formNum: "9981801159",
      toNum: alluser, // باید به صورت آرایه از شماره‌ها باشد
      content: `
            ${message}
            لغو11
            `,
      type: "1",
      username: "alirezamahmooudi94",
      password: "2981228935",
    };

    // ایجاد کلاینت SOAP
    const client = await soap.createClientAsync(wsdlUrl);

    // فراخوانی متد SendSMS
    const result = await client.SendSMSAsync(sendSmsInformation);

    res.json({
      result,
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};
