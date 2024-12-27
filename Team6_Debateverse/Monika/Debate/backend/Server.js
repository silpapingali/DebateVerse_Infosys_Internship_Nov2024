
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const authRoutes = require('./routes/auth');
const debateRoutes = require("./routes/debate");
const adminRoutes = require("./routes/admin");
const db = require('./config/db');
const app = express();



app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/debate', debateRoutes);
app.use('/api/admin', adminRoutes); 




app.listen(8081, () => {
  console.log('Server is running on http://localhost:8081');
});
