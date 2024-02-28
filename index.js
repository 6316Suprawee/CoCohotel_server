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

// สร้างโมเดล Reservation
const Reservation = mongoose.model('reservations', {
  roomType: String,
  price: Number,
  checkInDate: String,
  checkOutDate: String,
  confirmationDetails: String,
  name: String,
  email: String,
  phoneNumber: String, // เพิ่มเบอร์โทรศัพท์
  selectedFile: String,
});

// เส้นทางสำหรับการลงทะเบียนผู้ใช้
app.post('/api/register', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { email, password, confirmPassword, Name, Lastname } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Email already exists');
      return res.status(400).send({ err: 'err' });
    }
    const user = new User(req.body);
    await user.save();
    console.log('User saved successfully:', user);
    res.status(201).send({ err: '' });
    return;
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ err: 'err' });
  }
});

// เส้นทางสำหรับการบันทึกข้อมูลการจอง
app.post('/api/reservations', async (req, res) => {
  try {
    const { roomType, price, checkInDate, checkOutDate, confirmationDetails, name, email, phoneNumber, selectedFile } = req.body; // ดึงข้อมูลจาก request body
    const reservation = new Reservation({ roomType, price, checkInDate, checkOutDate, confirmationDetails, name, email, phoneNumber, selectedFile }); // สร้าง object Reservation ใหม่
    await reservation.save(); // บันทึกข้อมูลลงในฐานข้อมูล
    console.log('Reservation saved successfully:', reservation);
    res.status(201).send({ message: 'Reservation saved successfully' });
  } catch (error) {
    console.error('Error saving reservation:', error);
    res.status(500).send({ error: 'Error saving reservation' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;
