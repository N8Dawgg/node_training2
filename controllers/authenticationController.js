const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const authenticateUsernameAndPassword = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }
  const matchingUser = usersDB.users.find(
    (person) => person.username === username
  );
  if (!matchingUser) return res.sendStatus(401);

  try {
    const match = await bcrypt.compare(password, matchingUser.password);

    if (match) {
      //create JWT.
      res.json({ success: `Welcome to the server, ${username}!!` });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { authenticateUsernameAndPassword };
