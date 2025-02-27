const soap = require('soap');
const mongoose = require('mongoose')


const wsdlUrl = 'http://87.248.137.75/webservice/send.php?wsdl';

mongoose.connect('mongodb://mongodb:27017/Savecode', {
    serverSelectionTimeoutMS: 300000,  // افزایش تایم‌اوت انتخاب سرور به 5 دقیقه (300000 میلی‌ثانیه)
    socketTimeoutMS: 300000,           // افزایش تایم‌اوت سوکت به 5 دقیقه (300000 میلی‌ثانیه)
  })
  .then(() => console.log("connected to savecode"))
  .catch(err => console.log("can't connect to savecode:", err));
  


const seveCode = new mongoose.Schema({
    number : String,
    code : String
})

const SaveCode = mongoose.model('savecode', seveCode)

exports.sendSMS = async (req, res) => {
    
    const randomCode = Math.floor(Math.random() * 90000) + 10000;
    
    const {number} = req.body;
    if (number.length !== 11) {
        res.json({massage: "number fild err"})
    }
    
    const sendSmsInformation = {
        "formNum" : "9981801159",
        "toNum" : [number],
        "content" : `اسپیدی عزیز خوش آمدی
         کد ورود شما : ${randomCode}
         لغو11
        `,
        "type" : "1",
        "username" : "alirezamahmooudi94",
        "password" : "2981228935"
    }

    try {
        // ایجاد کلاینت SOAP
        const client = await soap.createClientAsync(wsdlUrl);

        // فراخوانی متد SendSMS
        const result = await client.SendSMSAsync(sendSmsInformation);

        // ارسال نتیجه به کلاینت
          

        const savecodee = new SaveCode({
           number : number,
           code : randomCode         
        })
        

        const savecode = await savecodee.save()

        const ID = savecode._id
        console.log(ID);
        

        const int = setInterval(async () => {
            try {
                const findId = await SaveCode.findOne({ _id: ID }); // اصلاح این قسمت
                if (!findId) {
                    console.log("کد پیدا نشد، حذف متوقف شد.");
                    clearInterval(int);
                    return;
                }
        
                await SaveCode.deleteOne({ _id: ID }); // حذف رکورد از دیتابیس
                console.log("کد با موفقیت حذف شد.");
        
                clearInterval(int); // حالا که حذف انجام شد، Interval رو متوقف می‌کنیم
            } catch (error) {
                console.error("خطا در حذف کد:", error);
                clearInterval(int); // در صورت بروز خطا هم Interval متوقف بشه
            }
        }, 120000);


        res.json({
          result : result,
          data  : savecode,
          massage: "Done successfully"
        })
    } catch (err) {
        // مدیریت خطا
        console.error('خطا در ارسال پیامک:', err);
        return res.status(500).send('خطا در ارسال پیامک');
    }
};



