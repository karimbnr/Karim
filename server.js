const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect('mongodb://localhost:27017/facebook-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// نموذج المستخدم
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

// نموذج الرسالة
const MessageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    image: String,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

// إعداد Multer لرفع الصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Middleware لتحليل JSON
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// تسجيل مستخدم جديد
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send('تم إنشاء الحساب بنجاح!');
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.status(200).send('تم تسجيل الدخول بنجاح!');
    } else {
        res.status(400).send('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
});

// إرسال رسالة
app.post('/send-message', upload.single('image'), async (req, res) => {
    const { sender, receiver, message } = req.body;
    const image = req.file ? req.file.path : null;
    const newMessage = new Message({ sender, receiver, message, image });
    await newMessage.save();
    res.status(201).send('تم إرسال الرسالة بنجاح!');
});

// تشغيل الخادم
const server = app.listen(PORT, () => {
    console.log(`الخادم يعمل على http://localhost:${PORT}`);
});

// إعداد Socket.io للتواصل في الوقت الفعلي
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('مستخدم متصل:', socket.id);

    socket.on('send-message', (message) => {
        io.emit('receive-message', message);
    });

    socket.on('disconnect', () => {
        console.log('مستخدم انقطع:', socket.id);
    });
});
