const express = require('express');
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

const SendSmsRoute = require('./Signup/RsendSMS')
app.use("/api/register", SendSmsRoute)

const Admin = require('./admin/Radmin')
app.use("/api/admin", Admin)

const webData = require('./webInformation/RwebInformation')
app.use("/api/webdata", webData)



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});