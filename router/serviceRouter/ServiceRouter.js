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

async function Service() {
  try {
    await client.connect();
    const database = client.db("jim-education");
    // ------------------->
    const servicesCollection = database.collection("JIMservices");
    // GET API
    router.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const service = await cursor.toArray();
      // console.log(service)
      res.json(service);
    });

    // POST SERVICES
    router.post("/addServices", async (req, res) => {
      const service = req.body;
      console.log(service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // get single service
    router.get("/services/:ID", async (req, res) => {
      const id = req.params.ID;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });
    // DELETED ADMITION
    router.delete("/deleteService/:ID", async (req, res) => {
      const result = await servicesCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      console.log(result);
      res.json(result);
    });
  } finally {
  }
}
Service();
module.exports = router;
