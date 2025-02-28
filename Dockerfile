# از Node.js استفاده می‌کنیم
FROM node:16

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی کردن package.json و نصب وابستگی‌ها
COPY package*.json ./
RUN npm install

# کپی کردن تمام فایل‌ها به داخل کانتینر
COPY . .

# پورت 3001 را برای بک‌اند باز می‌کنیم
EXPOSE 3001

# اجرای اپلیکیشن
CMD ["npm", "start"]
