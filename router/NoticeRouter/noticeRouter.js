const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqdph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Notice = async () => {
  try {
    await client.connect();
    const database = client.db("jim-education");
    const notice = database.collection("notice");

    router.post("/notices", async (req, res) => {
      const service = req.body;
      console.log(service);

      const result = await notice.insertOne(service);
      console.log(result);
      res.json(result);
    });
    router.get("/notices", async (req, res) => {
      const cursor = notice.find({});
      const service = await cursor.toArray();
      // console.log(service)
      res.json(service);

      router.get("/notices/:ID", async (req, res) => {
        const id = req.params.ID;
        const query = { _id: ObjectId(id) };
        const result = await notice.findOne(query);
        res.json(result);
      });
    });
    // DELETED
    router.delete("/notice/:id", async (req, res) => {
      const result = await notice.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.json(result);
    });
  } finally {
  }
};
Notice();
module.exports = router;
