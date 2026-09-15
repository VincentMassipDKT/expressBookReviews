const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  if (!username || !password) {
    return false;
  }
  return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req?.body?.username;
  const password = req?.body?.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  };
  
  if (authenticatedUser(username, password)) {
    // Generate JWT token for the authenticated user
    const token = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });
    // Store access token and username in the session
    req.session.authorization = { token, username };
    return res.status(200).json({ message: `User [ ${username} ] logged in successfully` });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
