const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localHost",
    use: "root",
    password: "",
    database: "register"
})

app.post('/register',(req,res) => {
    const sql = "INSERT INTO login(`name`,`email`,`password`) VALUES (?)"
    const values=[
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login',(req,res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email,req.body.password], (err, data) => {
        if(err){
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json("success");
        }
        else{
            return res.json("Fail");
        }
    })
})

app.listen(8081, ()=> {
    console.log("listening");
})