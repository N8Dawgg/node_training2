const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  //checks to see if you have cookies, and then if the cookies have a "jwt" element.
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  const matchingUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!matchingUser) return res.sendStatus(403); //The refresh token you have does not have a user pair

  //verify the refreshToken
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    //check for errors or if the username does not match the "decoded" user.
    if (err || matchingUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(matchingUser.roles);
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
