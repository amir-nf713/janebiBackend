const soap = require('soap');
const mongoose = require('mongoose')


const wsdlUrl = 'http://87.248.137.75/webservice/send.php?wsdl';

mongoose
   .connect("mongodb://localhost:27017/Savecode")
   .then(()=> console.log("connected to savecode"))
   .catch(()=> console.log("cant connected to savecode"))



const seveCode = new mongoose.Schema({
    number : String,
    code : Number
})

const SaveCode = mongoose.model('savecode', seveCode)

exports.senSMS = async (req, res) => {
    
    const randomCode = Math.floor(Math.random() * 90000) + 10000;
    
    const {number} = req.body;
    if (number.length !== 11) {
        res.json({massage: "number fild err"})
    }
    
    const sendSmsInformation = {
        "formNum" : "30005112",
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

        setInterval(async () => {
            const findId = await SaveCode.findOne(ID)
            if (!findId) {
                return res.json({ massage : "cant find code"})
            }

            const deletCode = await SaveCode.deleteOne({_id : ID})
            if (!deletCode) {
                return res.json({ massage : "cant delete code"})
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



