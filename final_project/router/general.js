const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req?.body?.username;
  const password = req?.body?.password;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  };

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ error: `User [ ${username} ] already exists` });
  };
  
  users.push({ username, password });
  return res.status(200).json({ success: `User [ ${username} ] registered successfully. Now you can login.` });
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const bookList = await fetchBooksPromise();
  console.log(bookList);
  return res.status(200).json(bookList);
});

// Promise to get the book list
async function fetchBooksPromise() {
  return new Promise((resolve, reject) => {
    const bookList = JSON.stringify(Object.values(books), null, 2);
    try {
      resolve(bookList);
    } catch (e) {
      reject(new Error(`Failed to fetch book list: ${e.name} - ${e.message}`));
    };
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const book = await fetchBookByISBNPromise(isbn);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ error: `No book found for ISBN [ ${isbn} ]` });
  };
});

// Promise to get book details based on ISBN
async function fetchBookByISBNPromise(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    try {
      resolve(book);
    } catch (e) {
      reject(new Error(`Failed to find book with ISBN [ ${isbn} ]: ${e.name} - ${e.message}`));
    };
  });
};

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const booksByAuthor = await fetchBooksByAuthorPromise(author);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ error: `No books found for author [ ${author} ]` });
  };
});

// Promise to get book details based on author
async function fetchBooksByAuthorPromise(author) {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    try {
      resolve(booksByAuthor);
    } catch (e) {
      reject(new Error(`Failed to find books with author [ ${author} ]: ${e.name} - ${e.message}`));
    };
  });
};

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const booksByTitle = await fetchBooksByTitlePromise(title);
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ error: `No books found for title [ ${title} ]` });
  };
});

// Promise to get book details based on title
async function fetchBooksByTitlePromise(title) {
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    try {
      resolve(booksByTitle);
    } catch (e) {
      reject(new Error(`Failed to find books with title [ ${title} ]: ${e.name} - ${e.message}`));
    };
  });
};

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ error: `No book found for ISBN [ ${isbn} ]` });
  };
});

// ----- ----- -------------------- ----- -----
// ----- ----- AXIOS IMPLEMENTATION ----- -----

const axios = require('axios');
const BASE_URL = 'http://localhost:5000';

// Axios implementation for fetching books
async function fetchBooksWithAxios() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch books with Axios: ${error.name} - ${error.message}`);
  };
};

// Axios implementation for fetching book by ISBN
async function fetchBookByISBNWithAxios(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch book with ISBN [ ${isbn} ] with Axios: ${error.name} - ${error.message}`);
  };
};

// Axios implementation for fetching books by author
async function fetchBooksByAuthorWithAxios(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch books by author [ ${author} ] with Axios: ${error.name} - ${error.message}`);
  };
};

// Axios implementation for fetching books by title
async function fetchBooksByTitleWithAxios(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch books by title [ ${title} ] with Axios: ${error.name} - ${error.message}`);
  };
};


module.exports.general = public_users;
module.exports.fetchBooksWithAxios = fetchBooksWithAxios;
module.exports.fetchBookByISBNWithAxios = fetchBookByISBNWithAxios;
module.exports.fetchBooksByAuthorWithAxios = fetchBooksByAuthorWithAxios;
module.exports.fetchBooksByTitleWithAxios = fetchBooksByTitleWithAxios;
