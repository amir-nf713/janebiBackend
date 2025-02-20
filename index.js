const express = require('express');
const { default: axios } = require('axios')
const security = require('./security'); 
const app = express()
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  })
  
app.use(express.json());
security(app);


app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});


const SendSmsRoute = require('./Signup/RsendSMS')
app.use("/api/register/sms", SendSmsRoute)

const Admin = require('./admin/Radmin')
app.use("/api/admin", Admin)

const webData = require('./webInformation/RwebInformation')
app.use("/api/webdata", webData)

const users = require('./user/Ruser')
app.use("/api/register/user", users)

const categori = require("./categori/Rcategori")
app.use("/api/categori", categori)

const stayInCall = require("./stayInCall/RstayInCall")
app.use("/api/stayincall", stayInCall)

const basket = require("./basket/Rbasket")
app.use('/api/basket', basket)

const kala = require("./kala/Rkala")
app.use("/api/Kala", kala)

const giftCode = require('./giftCode/Rgiftcode')
app.use("/api/Gitcode", giftCode)

const offerCode = require('./offerCode/Roffer')
app.use("/api/Offercode", offerCode)

//x5TpYwZ3g9RfZa


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});