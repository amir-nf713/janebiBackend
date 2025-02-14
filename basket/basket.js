const mongoose = require("mongoose");
const jalaali = require("jalaali-js")
const { toJalaali } = require('jalaali-js');

mongoose
  .connect("mongodb://localhost:27017/basket")
  .then(() => console.log("connect to basket"))
  .catch(() => console.log("cant connect to basket"));

const basket = new mongoose.Schema({
  value: {type : Array, default: []} ,
  vazeiat: String ,
  name: String,
  shahr: String,
  ostan: String,
  phoneNumber: String,
  address: String,
  postCode: String,
  shenase: Number,
  date: String,
  userId: String,
  money: Number
});

const Basket = mongoose.model("basket", basket);




exports.getBasket = async (req,res) => {
  try {
    res.json({
      date: await Basket.find()
    })
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
}

exports.postBasket = async (req,res) => {
  try {
    const { value, name, shahr, ostan, phoneNumber, address, postCode, userId, money } = req.body;

    // بررسی ورودی‌ها
    if (!value || !name || !shahr || !ostan || !phoneNumber || !address || !postCode || !userId || !money) {
      return res.status(400).json({ message: "تمامی فیلدها باید پر شوند." });
    }

    // دریافت تاریخ شمسی
    let today = new Date();
    let jalaaliDate = toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate()); // تبدیل تاریخ میلادی به شمسی

    // ایجاد سند جدید سبد خرید
    const newBasket = new Basket({
      value: value,  // می‌توانید مقدار پیش‌فرض برای این فیلد اضافه کنید
      vazeiat: "در حال انجام", 
      name: name,
      shahr: shahr,
      ostan: ostan,
      phoneNumber: phoneNumber,
      address: address,
      postCode: postCode,
      shenase: await Basket.countDocuments() + 6876,
      date: `${jalaaliDate.jy}-${jalaaliDate.jm}-${jalaaliDate.jd}`, // تاریخ به فرمت YYYY-MM-DD
      userId: userId,
      money: money
    });

    // ذخیره سبد خرید
    const result = await newBasket.save();

    // ارسال پاسخ موفقیت‌آمیز
    res.json({
      message: "سبد خرید با موفقیت اضافه شد.",
      data: result
    });

  } catch (error) {
    res.json({
      massage: "you have err:" + error ,
    });
  }
}


exports.putBasket = async (req,res) => {
  try {
   const shenase = req.params.shenase

   const findBasket = await Basket.findOne({ shenase })
   if (!findBasket) {
    return res.json({message: "cant find Basket"})
   }

   const updatedData = req.body;
   const Id = findBasket._id;

   const update = await Basket.findByIdAndUpdate(
     Id,
     { $set: updatedData },
     { new: true }
   );

   res.json({ update });





  } catch (error) {
    res.json({
      massage: "you have err" + error,
    });
  }
}



