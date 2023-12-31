require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 7000;
const { logReq } = require("./middleware/logEvents.js");
const { logErr } = require("./middleware/logErr.js");
const { verifyJWT } = require("./middleware/verifyJWT.js");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials.js");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn.js");

//connect to mongodb
connectDB();

app.use(logReq);

//Cross Origin Resource Sharing
const whitelist = require("./config/whiteList.js");
//checks the require origin to make sure the requester is valid. Has to match the white list.

app.use(credentials);

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      //THE || !origin part should be removed in the main release.
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//cookie parser
app.use(cookieParser());

//server static files
app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/", require("./routes/root.js"));
app.use("/register", require("./routes/register.js"));
app.use("/authentication", require("./routes/authentication.js"));
app.use("/refresh", require("./routes/refresh.js"));
app.use("/logout", require("./routes/logout.js"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees.js"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  }
});

app.use(logErr);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
