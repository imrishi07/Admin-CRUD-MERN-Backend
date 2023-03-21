require("dotenv").config();
require("./db/conn.js");
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/router");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("./uploads"));
app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server start at port number ${PORT}`);
});
