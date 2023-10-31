const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const ROLES_LIST = require("../config/rolesList");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }
  const userAlreadyExists = usersDB.users.find(
    (person) => person.username === username
  );
  if (userAlreadyExists) return res.sendStatus(409);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: req.body.username,
      roles: { User: ROLES_LIST.User },
      password: hashedPassword,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
