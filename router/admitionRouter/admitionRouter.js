const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqdph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Admition = async () => {
  try {
    await client.connect();
    const database = client.db("jim-education");
    const admitCollection = database.collection("admitionALL");

    // GET ADMITION
    router.get("/admition", async (req, res) => {
      const cursor = admitCollection.find({});
      console.log(cursor);
      const admit = await cursor.toArray();
      // console.log(admit);
      res.json(admit);
    });

    router.post("/AddAdmition", async (req, res) => {
      const admition = req.body;
      // console.log('files',req.files)
      const pic = req.files.image;

      const picData = pic.data;

      const encidPic = picData.toString("base64");
      const imageBaffer = Buffer.from(encidPic, "base64");

      // console.log(imageBaffer)
      //     console.log('file',req.file);

      const AllItem = {
        admition,

        image: imageBaffer,
      };
      // console.log(AllItem)
      const result = await admitCollection.insertOne(AllItem);
      // console.log(result);
      res.send(result);
    });

    // DELETED ADMITION
    router.delete("/deleteAdmition/:id", async (req, res) => {
      const result = await admitCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.json(result);
    });

    //   single admition
    router.get("/admition/:booking", async (req, res) => {
      const id = req.params.booking;
      const query = { _id: ObjectId(id) };
      const result = await admitCollection.findOne(query);
      res.json(result);
    });
  } finally {
  }
};

Admition();
module.exports = router;
