// external imports
const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqdph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const student = async () => {
  try {
    await client.connect();
    const database = client.db("jim-education");
    const studentColllection = database.collection("students");
    // GET STUDENT

    router.get("/students", async (req, res) => {
      const cursor = studentColllection.find({});
      const student = await cursor.toArray();
      // console.log(service)
      res.json(student);
    });
    // ADD STUDENT
    router.post("/addStudent", async (req, res) => {
      const service = req.body;
      console.log(service);

      const result = await studentColllection.insertOne(service);
      console.log(result);
      res.json(result);
    });
  } finally {
  }
};
student();
module.exports = router;
