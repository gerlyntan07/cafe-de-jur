const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const login = require("./routes/login");
app.use("/api/login", login);

app.get('/', (req, res) => {
    console.log("Request received at '/'");
    res.send('Hello, World!');
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Internal Server Error');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
