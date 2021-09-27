const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const databasePath = path.join(__dirname, "userData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const encryptedPw = await bcrypt.hash(password, 10);
  const userQuery = `
  SELECT
  *
  FROM
  user
  WHERE
  username = '${username}'
  ;`;
  const user = await database.get(userQuery);
  if (user !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    const addUser = `
      INSERT
      INTO
      user
      (username, name, password, gender, location)
      VALUES ('${username}', '${name}', '${hashedPassword}', '${gender}', ${location}');`;
    if (password.length < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      await database.run(addUser);
      response.send("User created successfully");
    }
  }
});

module.exports = app;
