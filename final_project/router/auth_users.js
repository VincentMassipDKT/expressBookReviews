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
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req?.body?.username;
  const password = req?.body?.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  };
  
  if (authenticatedUser(username, password)) {
    // Generate JWT token for the authenticated user
    let accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });
    // Store access token and username in the session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: `User [ ${username} ] logged in successfully` });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  };
});



regd_users.get("/auth", (req, res) => {
  const username = req.session?.authorization?.username;
  const accessToken = req.session?.authorization?.accessToken;
  
  if (!username || !accessToken) {
    return res.status(401).json({ message: "User isn't logged in" });
  }
  return res.status(200).json({ message: `User [ ${username} ] is authenticated with token [ ${accessToken} ]` });
});




// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params?.isbn;
  const review = req?.body?.review;
  const username = req.session?.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User isn't logged in" });
  };

  if (!books[isbn]) {
    return res.status(404).json({ message: `No book found for ISBN [ ${isbn} ]` });
  };

  if (!review) {
    return res.status(400).json({ message: "Review content is missing" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `Review successfully added/updated by [ ${username} ] for ISBN [ ${isbn} ]` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
