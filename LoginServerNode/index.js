const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('./user.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});

app.use(express.json());

app.post('/user', (req, res) => {
    const { username, password, email } = req.body;
    const sql = `INSERT INTO user (username, password, email) VALUES (?, ?, ?)`;
    db.run(sql, [username, password, email], (err) => {
        if (err) {
            return console.error(err.message);
            res.status(500).send("Internal server error");
        } else {
            res.status(201).send("User created");
        }     
    });
});

app.get('/user', (req,res) => {
    db.all(`SELECT * FROM user`, (err, rows) => {
        if (err) {
            return console.error(err.message);
            res.status(500).send("Internal server error");
        } else {
            res.status(200).send(rows);
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM user WHERE username = ? AND password = ?`;
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return console.error(err.message);
            res.status(500).send("Internal server error");
        } else {
            if (row) {
                res.status(200).send("Login successful");
            } else {
                res.status(401).send("Invalid credentials");
            }
        }
    });
});
    
//Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});