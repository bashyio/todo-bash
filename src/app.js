const path = require("path");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const publicDir = path.join(__dirname, "../public");
const jsonPath = path.join(__dirname, "../data.json");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(publicDir));

app.listen(80, () => {
  console.log("Server is up on port 80.");
});

//Route get requests for the fetch() requests from functions.js
app.get("/data-io", (req, res) => {
  if (req.query.rType != "fetchList") {
    return res.status(400).send({
      error: "Invalid Request.",
    });
  }

  const data = JSON.parse(fs.readFileSync(jsonPath).toString());

  res.status(200).send(data);
});

//Route post requests for the fetch() requests from functions.js
app.post("/data-io", (req, res) => {
  if (req.query.rType != "saveList") {
    return res.status(400).send({
      error: "Invalid Request.",
    });
  }

  const data = req.body;
  fs.writeFileSync(jsonPath, JSON.stringify(data));
  res.sendStatus(200);
});
