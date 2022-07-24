const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require("dotenv");
const Teacher = require("./router/teacherRouter/teacherRouter");
const student = require("./router/StudentRouter/StudentRouter");
const service = require("./router/serviceRouter/ServiceRouter");
const User = require("./router/userRoute/userRouter");
const Admition = require("./router/admitionRouter/admitionRouter");
const Result = require("./router/result/ResultRouter/ResultRouter");
const Order = require("./router/admitionRouter//orderRouter");
const Blog = require("./router/blogRouter/BlogRouter");
const Notice = require("./router/NoticeRouter/noticeRouter");
const serviceAccount = require("./education-web-admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqdph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// ROUTER set-up
app.use("/teacher", Teacher);
app.use("/student", student);
app.use("/service", service);
app.use("/User", User);
app.use("/Admition", Admition);
app.use("/result", Result);
app.use("/Order", Order);
app.use("/blog", Blog);
app.use("/Notice", Notice);

app.get("/", (req, res) => {
  res.send("HEllow world");
});

app.listen(port, () => {
  console.log("Running server port");
});
