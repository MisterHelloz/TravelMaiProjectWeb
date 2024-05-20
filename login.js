const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'accounts',
  port : 3307
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve index.html as the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});
app.get('register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});



// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Perform authentication logic using MySQL
  const query = `SELECT * FROM accounts WHERE username = ? AND password = ?`;
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 1) {
      // Redirect to index1 upon successful login
      res.redirect('/index1');
    } else {
      res.send('Login failed');
    }
  });
});

// Serve index1.html
app.get('/index1', (req, res) => {
  res.sendFile(path.join(__dirname,'index1.html'));
});

// Handle logout
app.get('/logout', (req, res) => {
  app.get('/logout', (req, res) => {
    // Perform logout actions here (e.g., clear session, cookies, etc.)
    // Redirect to the login page or any other appropriate page
    res.redirect('/');
  });
});

// Handle user registration
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if username already exists
  const usernameQuery = `SELECT * FROM accounts WHERE username = ?`;
  connection.query(usernameQuery, [username], (err, usernameResults) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Check if email already exists
    const emailQuery = `SELECT * FROM accounts WHERE email = ?`;
    connection.query(emailQuery, [email], (err, emailResults) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      if (usernameResults.length > 0) {
        // Username already exists
        res.send('Username already exists');
      } else if (emailResults.length > 0) {
        // Email already exists
        res.send('Email already exists');
      } else {
        // Insert new user into the database
        const insertQuery = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`;
        connection.query(insertQuery, [username, email, password], (err, insertResults) => {
          if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          // Registration successful, redirect to login page
          res.redirect('/');
        });
      }
    });
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
