const express = require('express');
const mongoose = require('mongoose');

// ایجاد اپلیکیشن Express
const app = express();

// تنظیم پورت
const PORT = 3001;

// استفاده از middleware برای تجزیه JSON
app.use(express.json());

// اتصال به MongoDB
mongoose
  .connect("mongodb://localhost:27017/Savecode", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // اگر اتصال برقرار نشد، برنامه متوقف می‌شود.
  });

// تعریف اسکیمای ساده
const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true }
});

// مدل برای ذخیره اطلاعات
const TestModel = mongoose.model('Test', testSchema);

// API برای اضافه کردن داده به دیتابیس
app.post('/api/test', async (req, res) => {
  const { name, phoneNumber } = req.body;

  if (!name || !phoneNumber) {
    return res.status(400).json({ message: 'Name and phone number are required' });
  }

  try {
    // داده جدید برای ذخیره‌سازی
    const testData = new TestModel({ name, phoneNumber });

    // ذخیره داده در دیتابیس
    const result = await testData.save();
    res.status(201).json({ message: 'Data saved successfully', data: result });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data', error: error.message });
  }
});

// API برای گرفتن تمام داده‌ها از دیتابیس
app.get('/api/test', async (req, res) => {
  try {
    const data = await TestModel.find();
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
