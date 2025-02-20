const mongoose = require('mongoose');

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

// تابع تست ذخیره‌سازی اطلاعات
const testSave = async () => {
  try {
    // داده برای ذخیره‌سازی
    const testData = new TestModel({
      name: 'John Doe',
      phoneNumber: '09336230914'
    });

    // ذخیره داده در دیتابیس
    const result = await testData.save();
    console.log("Data saved successfully:", result);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// اجرا کردن تابع تست
testSave();
