// security.js

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');


// بارگذاری متغیرهای محیطی
dotenv.config();

module.exports = (app) => {
  // استفاده از helmet برای افزایش امنیت هدرهای HTTP
  app.use(helmet());

  // تنظیمات CORS
  const corsOptions = {
    origin: '*', // دامنه مجاز
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };
  app.use(cors(corsOptions));

  // محدود کردن تعداد درخواست‌ها
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 100, // حداکثر درخواست‌ها
    message: "Too many requests, please try again later.",
  });
  app.use(limiter);

  // محافظت از CSRF
 
  // این‌جا می‌توانید سایر تنظیمات امنیتی مثل مسیرهای حساس و ... را اضافه کنید
};