// app.js

const express = require('express');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = 4000;
const sequelize = require('./Database')
const User = require('./User')



const cookieParser = require("cookie-parser");
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials : true
  
}

app.use(cors(corsOptions));

const { Op } = require('sequelize');

const JWT_SECRET = 'xJH3@k8a!3nLz$k#B9aPq%3fDgVt7NcM';




// Middleware to parse JSON
app.use(express.json());

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


const authorization = (req, res, next) => {
  // const token = req.cookies.access_token;

  // if(!token) {
  //   return res.sendStatus(403);
  // }

  const authorization  = req.headers["authorization"];
  if (!authorization) {
    return res.sendStatus(403);
  }
  const token = authorization.split(" ")[1];
  

  try{
    const data = jwt.verify(token, JWT_SECRET);
    req.id = data.id;
    req.name = data.name;
    return next();
  }
  catch {
    return res.sendStatus(403);
  }
}

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
    const token = jwt.sign({ id: user.id, name: user.username }, JWT_SECRET, {expiresIn : "1h"});
    // console.log("token", token);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: 'None'
    }).status(200).json({ token: token, message: "Logged in successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/logout', authorization, (req, res) => {
  return res.clearCookie("access_token").status(200)
  .json({message : "Logout Success !"});
})

app.get("/welcome", authorization, (req, res) => {
  return res.json({user : {id : req.id, name: req.name}});
})


// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});


