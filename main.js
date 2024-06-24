import express from "express";
import users from "./MOCK_DATA.json" assert { type: "json" };
import fs from "fs";
const app = express();

const PORT = 8000;

// Middleware to parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app
  .route("/api/users")
  .get((req, res) => {
    return res.json(users);
  })
  .post((req, res) => {
    const newUser = req.body;
    users.push({ ...newUser, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: err.message });
      }
      return res.json({ status: "user added" });
    });
  });

app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users
              .map((user) => {
                return `<li>${user.first_name}</li>`;
              })
              .join("")}
        </ul>
    `;

  return res.send(html);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const newUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(newUsers), (err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: err.message });
      }
      return res.json({ status: "user deleted" });
    });
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: err.message });
      }
      return res.json({ status: "user updated", user: updatedUser });
    });
  });

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
