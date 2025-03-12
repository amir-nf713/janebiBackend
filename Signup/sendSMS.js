const soap = require('soap');
const mongoose = require('mongoose');
const { default: apiKey } = require('../mongo');

const wsdlUrl = 'http://87.248.137.75/webservice/send.php?wsdl';

mongoose.connect(`mongodb://${apiKey.db}/Savecode`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const seveCode = new mongoose.Schema({
  number: String,
  code: String,
  expiresAt: { type: Date, default: Date.now, index: { expires: '2m' } }
});

const SaveCode = mongoose.model('savecode', seveCode);

exports.sendSMS = async (req, res) => {
  const randomCode = Math.floor(Math.random() * 90000) + 10000;
  const { number } = req.body;

  if (number.length !== 11) {
    return res.json({ massage: "number field err" });
  }

  const sendSmsInformation = {
    formNum: "9981801159",
    toNum: [number],
    content: `اسپیدی عزیز خوش آمدی
      کد ورود شما : ${randomCode}
      لغو11
    `,
    type: "1",
    username: "alirezamahmooudi94",
    password: "2981228935"
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
    console.error('خطا در ارسال پیامک یا ذخیره‌سازی کد:', err);
    return res.status(500).send('خطا در ارسال پیامک یا ذخیره‌سازی کد');
  }
};