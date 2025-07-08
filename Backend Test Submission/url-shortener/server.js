const express = require("express");
const app = express();

app.use(express.json()); // Support JSON body parsing

// GET route to test server
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// POST route to test Postman
app.post("/test", (req, res) => {
  console.log("Received POST data:", req.body);
  res.json({ message: "POST request received successfully", data: req.body });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
