const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
// เชื่อมต่อ MongoDB
mongoose.connect('mongodb+srv://Project:kEPfyIDZqpu8NWJA@cluster0.ldskony.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.pluralize(null);
// สร้างโมเดล User
const User = mongoose.model('users', {
  email: String,
  password: String,
  confirmPassword: String,
  Name: String,
  Lastname: String,
});

// เส้นทางสำหรับการลงทะเบียนผู้ใช้
app.post('/api/register', async (req, res) => {
  try {
    console.log('Request body:', req.body); // ตรวจสอบข้อมูลที่ถูกส่งมาจาก client
    const { email,password,confirmPassword,Name,Lastname } = req.body;
    const user = new User(req.body);
    await user.save();
    console.log('User saved successfully:', user); // ตรวจสอบข้อมูลผู้ใช้ที่ถูกบันทึกลงใน MongoDB
    res.status(201).send('User registered successfully');
    return; // ส่ง response แล้วหยุดการทำงานของ function ทันที
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Registration error');
  }

});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;