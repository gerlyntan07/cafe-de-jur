const express = require("express");
const cors = require("cors");
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Middleware
// CORS configuration
const DB_PORT = process.env.DB_PORT || 3306;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session store
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: DB_PORT,
  user: process.env.DB_USER,
  password: '',
  database: process.env.DB_NAME
});
app.use(session({
  key: 'cafe_user_sid',
  name: 'cafe_user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Routes
const login = require("./routes/login");
app.use("/api", login);
const signup = require("./routes/signup");
app.use("/api", signup);
const user = require("./routes/user");
app.use("/api", user);
const product = require("./routes/product");
app.use("/api", product);

app.get('/', (req, res) => {
    console.log("Request received at '/'");
    res.send('Hello, World!');
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT;

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
