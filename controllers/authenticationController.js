const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
      const roles = Object.values(matchingUser.roles);
      //create JWT.
      //short term access token
      const accessToken = jwt.sign(
        { UserInfo: { username: matchingUser.username, roles: roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      //long term refresh token
      const refreshToken = jwt.sign(
        { username: matchingUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      //saving refresh token with current user
      const otherUsers = usersDB.users.filter(
        (person) => person.username !== matchingUser.username
      );
      const currentUser = { ...matchingUser, refreshToken };
      usersDB.setUsers([...otherUsers, currentUser]);
      await fsPromises.writeFile(
        path.join(__dirname, "..", "models", "users.json"),
        JSON.stringify(usersDB.users)
      );
      //refresh token sent as HTTP cookie (NOT JS COOKIE!!)
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, //one day in milliseconds
      });
      //access token sent as json to be stored in memory (NOT A COOKIE!!)
      res.json({ accessToken });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { authenticateUsernameAndPassword };
