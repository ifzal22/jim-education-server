const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqdph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Blog = async () => {
  try {
    await client.connect();
    const database = client.db("jim-education");
    const blog = database.collection("JIMservices");
    // POST blog
    router.post("/blogs", async (req, res) => {
      const service = req.body;
      console.log(service);

      const result = await blog.insertOne(service);
      console.log(result);
      res.json(result);
    });
    router.get("/blogs", async (req, res) => {
      const cursor = blog.find({});
      const service = await cursor.toArray();
      // console.log(service)
      res.json(service);
      router.get("/blogs/:ID", async (req, res) => {
        const id = req.params.ID;
        const query = { _id: ObjectId(id) };
        const result = await blog.findOne(query);
        res.json(result);
      });
    });
    // DELETED
    router.delete("/blog/:id", async (req, res) => {
      const result = await blog.deleteOne({
        _id: ObjectId(req.params.id),
      });
      console.log(result);
      res.json(result);
    });
    //   single
    router.get("/blog/:id", async (req, res) => {
      const id = req.params.booking;
      const query = { _id: ObjectId(id) };
      const result = await blog.findOne(query);
      res.json(result);
    });
  } finally {
  }
};
Blog();
module.exports = router;
