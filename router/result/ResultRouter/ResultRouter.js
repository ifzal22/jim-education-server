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

const Result = async () => {
  try {
    await client.connect();
    const database = client.db("jim-education");
    const resultPublishCollection = database.collection("result-publish");

    // GET API
    router.get("/results", async (req, res) => {
      const cursor = resultPublishCollection.find({});
      const result = await cursor.toArray();
      // console.log(result)
      res.json(result);
    });

    router.get("/result/:ID", async (req, res) => {
      const id = req.params.ID;
      const query = { _id: ObjectId(id) };
      const result = await resultPublishCollection.findOne(query);
      res.json(result);
    });

    // POST RESULT
    router.post("/Addresult", async (req, res) => {
      const admition = req.body;
      console.log(admition);

      const result = await resultPublishCollection.insertOne(admition);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
};

Result();
module.exports = router;
