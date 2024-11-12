const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup"
});

// Check database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

app.get('/', (req, res) => {
  res.send("Welcome to the server!");
});

app.post('/signup', (req, res) => {
  const name=req.body["name"];
  const email=req.body["email"]
  const password=req.body["password"]
  
  

  // Using parameterized query to avoid SQL injection
  const sql = "INSERT INTO `login`(`name`, `email`, `password`) VALUES (?, ?, ?)";
  const values = [name, email, password];


  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);  // Log error for debugging
      return res.status(500).json({ error: "An error occurred while saving the data." });
    }
    return res.status(200).json({ message: "User registered successfully", data });
  });
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    

    // Using parameterized query to avoid SQL injection
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const values = [email, password];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ 
                error: "An error occurred while checking credentials." 
            });
        }
        
        if (data.length > 0) {
            return res.status(200).json({ 
                success: true, 
                message: "Login successful", 
                data: data 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials", 
                data: [] 
            });
        }
    });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
