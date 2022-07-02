//imports
const express = require("express");
const { json } = require("express");
const router = require('./routers/router')
const en = require('ejs')

const app = express()
app.use(json());

app.use("/", router);
app.engine("html", en.renderFile)
app.set("views", 'views')
app.set("view engine", "ejs")
app.use(express.static('public'))

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});