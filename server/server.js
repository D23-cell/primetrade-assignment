const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));