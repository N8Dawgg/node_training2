const User = require("../models/User");
const bcrypt = require("bcrypt");
const ROLES_LIST = require("../config/rolesList");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }
  const userAlreadyExists = User.findOne({ username: username }).exec();
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
