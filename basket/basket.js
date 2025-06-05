const mongoose = require("mongoose");
const jalaali = require("jalaali-js");
const { toJalaali } = require("jalaali-js");
const { username, password, host, port } = require("../mongo");
const { default: axios } = require("axios");

// URL-Encode برای کاراکترهای خاص
const encodedUsername = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);

const uri = `mongodb://${encodedUsername}:${encodedPassword}@${host}:${port}/Savecode?authSource=admin`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Could not connect to MongoDB:", err.message);
  });

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

const MERCHANT_ID = "1d4d1c16-4308-4dd9-ae32-bd6eb2f5d86f"; // مرچنت زرین‌پال خودت
const CALLBACK_URL = "https://janebi-speed.ir/api/basket/verify";


let valuee = [];

exports.pay = async (req, res) => {
  const {
    amount,
    userId,
    value,

    name,
    shahr,
    ostan,
    phoneNumber,
    address,
    postCode,

    date,
    money,
  } = req.body;

  if (
    !amount ||
    !userId ||
    !value ||
    !name ||
    !shahr ||
    !ostan ||
    !phoneNumber ||
    !address ||
    !postCode ||
    !date ||
    !money
  ) {
    return res.status(400).json({ error: "اطلاعات ناقص است" });
  }

  const price = Number(amount * 10); // تبدیل تومان به ریال

  try {

    valuee = value
    
    const response = await axios.post(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      {
        merchant_id: MERCHANT_ID,
        amount: price,
        callback_url: `${CALLBACK_URL}?amount=${price}&userId=${userId}&name=${name}&shahr=${shahr}&ostan=${ostan}&phoneNumber=${phoneNumber}&address=${address}&postCode=${postCode}&date=${date}&money=${money}`,
        description: "خرید از فروشگاه جانبی‌اسپید",
      }
    );

    const { code, message, authority } = response.data.data;

    if (code === 100) {
      return res.json({
        url: `https://www.zarinpal.com/pg/StartPay/${authority}`,
      });
    } else {
      return res.status(400).json({ error: message || "خطای درخواست پرداخت" });
    }
  } catch (error) {
    console.error(
      "خطا در پرداخت زرین‌پال:",
      error?.response?.data || error.message
    );
    return res.status(500).json({ error: "خطای سرور در پرداخت" });
  }
};

exports.verify = async (req, res) => {
  const {
    Authority,
    Status,
    amount,

    name,
    shahr,
    ostan,
    phoneNumber,
    address,
    postCode,

    date,
    userId,
    money,
  } = req.query;

  if (
    !Authority ||
    !Status ||
    !amount ||
    !userId ||
    !name ||
    !shahr ||
    !ostan ||
    !phoneNumber ||
    !address ||
    !postCode ||
    !date ||
    !money
  ) {
    return res.status(400).send("اطلاعات ناقص است");
  }

  if (Status !== "OK") {
    return res.send("❌ پرداخت توسط کاربر لغو شد");
  }

  try {
    const response = await axios.post(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
      {
        merchant_id: MERCHANT_ID,
        amount: parseInt(amount),
        authority: Authority,
      }
    );

    const { code, ref_id, message } = response.data.data;

    if (code === 100) {
      // به‌روزرسانی وضعیت پرداخت

      // ثبت دوره برای کاربر
      const NewBascket = new Basket({
        value: valuee,
        vazeiat: "در حال بررسی",
        name,
        shahr,
        ostan,
        phoneNumber,
        address,
        postCode,
        shenase: ref_id,
        date,
        userId,
        money,
      });

      await NewBascket.save();

      const res = await axios.get(`https://janebi-speed.ir/api/Kala/`);
      const items = res.data.data;

      for (const elementa of valuee) {
        const item = items.find(el => el._id === elementa.id);
        if (!item) continue;

        const colorIndex = item.color.findIndex(c => c === elementa.color);
        if (colorIndex === -1) continue;

        const devaiceOk = item.devaiceOK.find(d => d.name === elementa.model);
        if (!devaiceOk) continue;

        const updatedMojodi = [...devaiceOk.mojodi];
        updatedMojodi[colorIndex] = Math.max(updatedMojodi[colorIndex] - elementa.quantity, 0);

        const updatedDevaiceOK = item.devaiceOK.map(d =>
          d.name === devaiceOk.name ? { ...d, mojodi: updatedMojodi } : d
        );

      //  https://janebi-speed.ir/api/basket/verify?amount=8000&userId=6835c36d8e36bfc7bb0a4a7d&value=[object%20Object]&name=amirreza%20naddaf&shahr=adchc&ostan=fars&phoneNumber=09336230914&address=egr%20tgrtgert%20ert%20hert%20her%20her%20ter%20t&postCode=1234567890&date=1749096231586&money=800&Authority=A000000000000000000000000000l32l2n75&Status=OK

        await axios.put(`https://janebi-speed.ir/api/Kala/${item._id}`, {
          devaiceOK: updatedDevaiceOK,
        });
      }

      axios.post(`https://janebi-speed.ir/api/register/sms/smsSendq`, {
        number : `${phoneNumber}`,
        name : `${name}`
      })

      return res.redirect(`https://janebi-speed.ir/UserPannle/byok?refId=${ref_id}&amount=${money}`);

    } else {
      return res.send(`❌ پرداخت ناموفق بود: ${message}`);
    }
  } catch (err) {
    console.error("خطا در تأیید پرداخت:", err?.response?.data || err.message);
    return res.status(500).send("خطای سرور در تأیید پرداخت");
  }
};

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
