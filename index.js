const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
var cors = require('cors');
app.use(cors());

mongoose.connect('mongodb+srv://Project:kEPfyIDZqpu8NWJA@cluster0.ldskony.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.pluralize(null);

const User = mongoose.model('users', {
  email: String,
  password: String,
  confirmPassword: String,
  Name: String,
  Lastname: String,
});

const Reservation = mongoose.model('reservations', {
  roomType: String,
  price: Number,
  checkInDate: String,
  checkOutDate: String,
  confirmationDetails: String,
  name: String,
  email: String,
  phoneNumber: String,
  selectedFile: String,
});

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

app.post('/api/reservations', async (req, res) => {
  try {
    const { roomType, price, checkInDate, checkOutDate, confirmationDetails, name, email, phoneNumber, selectedFile } = req.body;
    const reservation = new Reservation({ roomType, price, checkInDate, checkOutDate, confirmationDetails, name, email, phoneNumber, selectedFile });
    await reservation.save();
    console.log('Reservation saved successfully:', reservation);
    res.status(201).send({ message: 'Reservation saved successfully' });
  } catch (error) {
    console.error('Error saving reservation:', error);
    res.status(500).send({ error: 'Error saving reservation' });
  }
});

app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    console.log('Reservations fetched successfully:', reservations);
    res.status(200).send(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).send({ error: 'Error fetching reservations' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;