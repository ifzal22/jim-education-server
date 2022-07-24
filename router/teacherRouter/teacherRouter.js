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
async function Teacher() {
  try {
    await client.connect();
    const database = client.db("jim-education");
    const teachersCollention = database.collection("teacherData");
    // GET TEACHER
    router.get("/teachers", async (req, res) => {
      const cursor = teachersCollention.find({});
      // console.log(cursor)
      const teacher = await cursor.toArray();
      // console.log(teacher)
      res.send(teacher);
    });

    router.get("/teacher/:about", async (req, res) => {
      const id = req.params.about;
      const query = { _id: ObjectId(id) };
      const result = await teachersCollention.findOne(query);
      res.json(result);
    });

    // ADD TEACHER

    router.post("/addTeacher", async (req, res) => {
      const service = req.body;
      console.log(service);
      //    console.log('hit the post api', service);

      const result = await teachersCollention.insertOne(service);
      console.log(result);
      res.json(result);
    });
  } finally {
  }
}
Teacher();

module.exports = router;
