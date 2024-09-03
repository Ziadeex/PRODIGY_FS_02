const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const auth = require("./routes/auth");
const table = require("./routes/listRoute");

port = process.env.APP_PORT;
const currentDirectory = __dirname;
const buildDirectory = path.join(currentDirectory, "build");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: "*" }));

app.use(express.static(buildDirectory));

app.get("/", (req, res) => {
  res.send({ message: "Ok from the server side" });
});

app.use("/api/auth", auth);
app.use("/api/table", table);

app.listen(port, () => {
  console.log(`my app is running on ${port}`);
});
