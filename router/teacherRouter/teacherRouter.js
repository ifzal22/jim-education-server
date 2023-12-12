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

    // GET ADMITION
    router.get("/teachers", async (req, res) => {
      const cursor = teachersCollention.find({});
      console.log(cursor);
      const admit = await cursor.toArray();
      // console.log(admit);
      res.json(admit);
    });

    router.post("/AddTeacher", async (req, res) => {
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
      const result = await teachersCollention.insertOne(AllItem);
      // console.log(result);
      res.send(result);
    });

    // DELETED ADMITION
    router.delete("/deleteTeacher/:about", async (req, res) => {
      const result = await teachersCollention.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.json(result);
    });

    //   single admition
    router.get("/teacher/:booking", async (req, res) => {
      const id = req.params.booking;
      const query = { _id: ObjectId(id) };
      const result = await teachersCollention.findOne(query);
      res.json(result);
    });

    //    console.log('hit the post api', service);
  } finally {
  }
}
Teacher();

module.exports = router;
