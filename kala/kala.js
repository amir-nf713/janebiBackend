const mongoose = require('mongoose');

mongoose
  .connect("mongodb://mongodb:27017/Savecode")
  .then(() => console.log("connected to savecode"))
  .catch((err) => console.error("cant connected to savecode", err));


const kala = new mongoose.Schema({
   onvan: String,
   categori: String,
   berand: String,
   color: { type: Array, default: [] },
   money: Number,
   offer: Number,
   tozih: { type: Array, default: [] },
   photo: String,
   smallTozih: { type: Array, default: [] }, // اصلاح: به صورت آرایه ذخیره می‌شود
   devaiceOK: { type: Array, default: [] },
   garanti: String,
   star: Number,
   nazarat: { type: Array, default: [] },
   tagSearch: { type: Array, default: [] },
   shenase: Number,
});

const Kala = mongoose.model('kala', kala);

exports.getkalaOff = async (req, res) => {
    try {
        const sortedKala = await Kala.find().sort({ offer: -1 }); // مرتب‌سازی بر اساس offer به صورت نزولی
        res.json({
            data: sortedKala,
        });
    } catch (error) {
        res.json({
            message: "you have an error",
        });
    }
  };
  

exports.getnewkala = async (req, res) => {
    try {
        const newKala = await Kala.find().sort({ _id: -1 }); // مرتب‌سازی بر اساس _id نزولی و محدود کردن به 1 نتیجه
        res.json({
            data: newKala,
        });
    } catch (error) {
        res.json({
            message: "you have err",
        });
    }
};


exports.getkala = async (req, res) => {
    try {
        res.json({
            data: await Kala.find(),
        });
    } catch (error) {
        res.json({
            massage: "you have err",
        });
    }
};

exports.getonekala = async (req, res) => {
    try {
        const _id = req.params.id
        const kala = await Kala.findOne({_id})
        if (!kala) {
            return res.json({ message : "Kala not found"})
        }
        res.json({
            data: kala
        });
    } catch (error) {
        res.json({
            massage: "you have err",
        });
    }
};

exports.postkala = async (req, res) => {
    try {
        const { onvan, categori, berand, color, money, offer, tozih, photo, smallTozih, devaiceOK, garanti, tagSearch } = req.body;

        // console.log(onvan, categori, berand, color, money, offer, tozih, photo, smallTozih, devaiceOK, garanti, tagSearch);

        if (!onvan || !categori || !berand || !color || !money || !offer || !tozih || !photo || !smallTozih || !devaiceOK || !garanti || !tagSearch) {
            return res.json({ massage: "data cant empty" });
        }

        // اطمینان حاصل می‌کنیم که smallTozih به صورت آرایه ارسال می‌شود
        const formattedSmallTozih = smallTozih.map((item) => item.trim()); // پاکسازی رشته‌ها از هر گونه فاصله اضافی

        const newKala = new Kala({
            onvan: onvan,
            categori: categori,
            berand: berand,
            color: color,
            money: money,
            offer: offer,
            tozih: tozih,
            photo: photo,
            smallTozih: formattedSmallTozih, // ارسال به صورت آرایه
            devaiceOK: devaiceOK,
            garanti: garanti,
            star: 5,
            nazarat: [],
            tagSearch: tagSearch,
            shenase: await Kala.countDocuments()+ 687
        });

        const result = await newKala.save();

        res.json({
            data: result,
            message: "ok"
        });
    } catch (error) {
        res.json({
            massage: "you have err",
            error,
        });
    }
};

exports.putkala = async (req, res) => {
    try {
        const _id = req.params.id;

        const findKala = await Kala.findOne({ _id });
        if (!findKala) {
            return res.json({ message: "cant find kala" });
        }

        const updatedData = req.body;
        const Id = findKala._id;

        const update = await Kala.findByIdAndUpdate(Id, { $set: updatedData }, { new: true });

        res.json({ update });
    } catch (error) {
        res.json({
            massage: "you have err",
        });
    }
};

exports.deletkala = async (req, res) => {
    try {
        const _id = req.params.id;

        const findKala = await Kala.findOne({ _id });
        if (!findKala) {
            return res.json({ message: "cant find kala" });
        }

        const deleteKala = await Kala.deleteOne({ _id });

        res.json({
            data: deleteKala,
        });
    } catch (error) {
        res.json({
            massage: "you have err",
        });
    }
};
