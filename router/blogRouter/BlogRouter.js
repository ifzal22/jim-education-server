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
    const blog = database.collection("blogsAll");
    const blogComment = database.collection("blogComment");
    // POST blog
    router.post("/blogs", async (req, res) => {
      const service = req.body;

      const result = await blog.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // POST comment
    router.post("/comment", async (req, res) => {
      const service = req.body;

      const result = await blogComment.insertOne(service);
      console.log(result);
      res.json(result);
    });
    // comment get
    router.get("/comment", async (req, res) => {
      const cursor = blogComment.find({});
      const service = await cursor.toArray();
      // console.log(service)
      res.json(service);
    });

    // DELETED
    router.delete("/comment/:id", async (req, res) => {
      const result = await blogComment.deleteOne({
        _id: ObjectId(req.params.id),
      });
      console.log(result);
      res.json(result);
    });

    // Blog get
    router.get("/blogs", async (req, res) => {
      const cursor = blog.find({});
      const service = await cursor.toArray();
      // console.log(service)
      res.json(service);
    });

    //   single admition
    router.get("/blogs/:booking", async (req, res) => {
      const id = req.params.booking;
      const query = { _id: ObjectId(id) };
      const result = await blog.findOne(query);
      res.json(result);
    });

    // DELETED
    router.delete("/blogs/:id", async (req, res) => {
      const result = await blog.deleteOne({
        _id: ObjectId(req.params.id),
      });
      console.log(result);
      res.json(result);
    });
    //   single
  } finally {
  }
};
Blog();
module.exports = router;
