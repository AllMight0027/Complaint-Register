require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const auth = require("./routes/auth");
const user = require("./routes/user");
const complaint = require("./routes/complaint");
const twilio = require("twilio");

const app = express();

//twilio
const accountSid = "AC66e13e8feae364f1130f63b9fa48212e";
const authToken = "ce232bf4ca7daae947ec5d3b6d140ad7";
const client = new twilio(accountSid, authToken);

//bodyparser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//cookieparser middleware
app.use(cookieParser());

//cors middleware
app.use(cors());

//Mongodb connect
mongoose
  .connect(process.env.DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

//set routes to api
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/complaint", complaint);

port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({ you: "YEAH" });
});

app.get("/send-text", (req, res) => {
  const { recipient, text } = req.query;

  client.messages
    .create({
      body: text,
      to: "+91" + recipient,
      from: "+18304693492",
    })
    .then((e) => console.log(e))
    .catch((e) => console.log(e));
});

app.listen(port, () => {
  console.log(`Port ${port} is running`);
});
