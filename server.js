import express, { query } from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  return res.send("Hello from Home!");
});

app.get('/user', (req, res) => {
  return res.send(`Welcome, ${req.query.name}`);
})

app.listen(port, () => {
  console.log("Server Running");
});
