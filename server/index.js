require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/about', require('./routes/about'));

app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
