const soap = require("soap");
const mongoose = require("mongoose");
// const { db } = require('../mongo');  // وارد کردن apiKey.db از فایل mongo.js
const { username, password, host, port } = require("../mongo");

const wsdlUrl = "http://87.248.137.75/webservice/send.php?wsdl";

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

const seveCode = new mongoose.Schema({
  number: String,
  code: String,
  expiresAt: { type: Date, default: Date.now, index: { expires: "2m" } },
});

const SaveCode = mongoose.model("savecode", seveCode);

exports.sendSMS = async (req, res) => {
  const randomCode = Math.floor(Math.random() * 90000) + 10000;
  const { number } = req.body;

  if (number.length !== 11) {
    return res.json({ massage: "number field err" });
  }

  const sendSmsInformation = {
    formNum: "9981802432",
    toNum: [number],
    content: `سلام!
کد ورود به حساب شما: ${randomCode} 
برای ادامه، این کد رو توی سایت وارد کن.  
این کد تا 2 دقیقه فعاله و مخصوص شماست—لطفاً پیش خودتون نگهش دارین. 

www.janebi-speed.ir
لغو11
    `,
    type: "1",
    username: "alirezamahmooudi94",
    password: "2981228935",
  };

  try {
    // ایجاد کلاینت SOAP
    const client = await soap.createClientAsync(wsdlUrl);

    // فراخوانی متد SendSMS
    const result = await client.SendSMSAsync(sendSmsInformation);

    // ذخیره‌سازی کد در MongoDB
    const savecodee = new SaveCode({
      number: number,
      code: randomCode,
    });
    const savecode = await savecodee.save();
    const ID = savecode._id;
    console.log(ID);

    res.json({
      result: result,
      data: savecode,
      massage: "Done successfully",
    });
  } catch (err) {
    console.error("خطا در ارسال پیامک یا ذخیره‌سازی کد:", err);
    return res.status(500).send("خطا در ارسال پیامک یا ذخیره‌سازی کد");
  }
};


exports.sendSMSbybas = async (req, res) => {
  
  const { number , name} = req.body;

  

  const sendSmsInformation = {
    formNum: "9981802432",
    toNum: [number],
    content: `
     کاربر عزیز ${name} یک سفارش برای شما ثبت شده و درحال بررسی میباشد

www.janebi-speed.ir
لغو11
    `,
    type: "1",
    username: "alirezamahmooudi94",
    password: "2981228935",
  };

  try {
    // ایجاد کلاینت SOAP
    const client = await soap.createClientAsync(wsdlUrl);

    // فراخوانی متد SendSMS
    const result = await client.SendSMSAsync(sendSmsInformation);

    // ذخیره‌سازی کد در MongoDB
    
   
    
    

    res.json({
      result: result,
      massage: "Done successfully",
    });
  } catch (err) {
    console.error("خطا در ارسال پیامک یا ذخیره‌سازی کد:", err);
    return res.status(500).send("خطا در ارسال پیامک یا ذخیره‌سازی کد");
  }
};
