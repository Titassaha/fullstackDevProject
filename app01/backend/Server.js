// app.js

const express = require('express');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = 4000;
const sequelize = require('./Database')
const User = require('./User')
const JWT_SECRET = 'xJH3@k8a!3nLz$k#B9aPq%3fDgVt7NcM';
const { Op } = require('sequelize');


app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello, World!');
});



// Example route to create a new user
app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.create({ username, password });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({
        where: {
          username: {
            [Op.eq]: username,
          },
        },
      });
  
      // If user not found or password incorrect, return unauthorized
      if (!user || !(password == user.password)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  console.log(token);
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Sync the database and start the server
  sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }).catch(error => {
    console.error('Unable to connect to the database:', error);
  });


  