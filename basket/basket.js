const mongoose = require("mongoose");
const jalaali = require("jalaali-js");
const { toJalaali } = require("jalaali-js");
const { db } = require("../mongo"); // وارد کردن apiKey.db از فایل mongo.js

mongoose
  .connect(`mongodb://${db}/Savecode?authSource=admin`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const basket = new mongoose.Schema({
  value: { type: Array, default: [] },
  vazeiat: String,
  name: String,
  shahr: String,
  ostan: String,
  phoneNumber: String,
  address: String,
  postCode: String,
  shenase: Number,
  date: String,
  userId: String,
  money: Number,
});

const Basket = mongoose.model("basket", basket);

exports.getOneBasket = async (req, res) => {
  try {
    const _id = req.params.id;
    const basket = await Basket.findOne({ _id });
    if (!basket) {
      return res.json({ message: "basket not found" });
    }
    res.json({
      data: basket,
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.getBasket = async (req, res) => {
  try {
    res.json({
      data: await Basket.find(),
    });
  } catch (error) {
    res.json({
      massage: "you have err",
    });
  }
};

exports.postBasket = async (req, res) => {
  try {
    const {
      value,
      name,
      shahr,
      ostan,
      phoneNumber,
      address,
      postCode,
      userId,
      money,
    } = req.body;

    // console.log("Request Body:", req.body);

    // // بررسی ورودی‌ها
    // if (!value || !name || !shahr || !ostan || !phoneNumber || !address || !postCode || !userId || !money) {
    //   return res.status(400).json({ message: "تمامی فیلدها باید پر شوند." });
    // }

    // دریافت تاریخ شمسی
    let today = new Date();
    let jalaaliDate = toJalaali(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    ); // تبدیل تاریخ میلادی به شمسی

    // ایجاد سند جدید سبد خرید
    const newBasket = new Basket({
      value: value, // می‌توانید مقدار پیش‌فرض برای این فیلد اضافه کنید
      vazeiat: "در حال انجام",
      name: name,
      shahr: shahr,
      ostan: ostan,
      phoneNumber: phoneNumber,
      address: address,
      postCode: postCode,
      shenase: (await Basket.countDocuments()) + 6876,
      date: `${jalaaliDate.jy}-${jalaaliDate.jm}-${jalaaliDate.jd}`, // تاریخ به فرمت YYYY-MM-DD
      userId: userId,
      money: money,
    });

    // ذخیره سبد خرید
    const result = await newBasket.save();

    // ارسال پاسخ موفقیت‌آمیز
    res.json({
      message: "سبد خرید با موفقیت اضافه شد.",
      data: result,
    });
  } catch (error) {
    res.json({
      massage: "you have err:" + error,
    });
  }
};

exports.putBasket = async (req, res) => {
  try {
    const shenase = req.params.shenase;

    const findBasket = await Basket.findOne({ shenase });
    if (!findBasket) {
      return res.json({ message: "cant find Basket" });
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
};
