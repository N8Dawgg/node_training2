const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogOut = async (req, res) => {
  const cookies = req.cookies;
  //checks to see if you have cookies, and then if the cookies have a "jwt" element.
  if (!cookies?.jwt) {
    return res.sendStatus(204); // this is a success because you're already logged out.
  }
  const refreshToken = cookies.jwt;
  const matchingUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!matchingUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  } // successful but no content.

  //saving refresh token with current user
  const otherUsers = usersDB.users.filter(
    (person) => person.username !== matchingUser.username
  );
  const currentUser = { ...matchingUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true }); //secure: true will make it only serve on https
  res.sendStatus(402);
};

module.exports = { handleLogOut };
