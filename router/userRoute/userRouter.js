// external imports
const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const admin = require("firebase-admin");
const serviceAccount = require("../../education-web-admin-sdk.json");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqdph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// VERIFY TOKEN
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.decodedEmail = decodedUser.email;
    } catch {}
  }
  next();
}
async function User() {
  try {
    await client.connect();
    const database = client.db("jim-education");
    // ------------------->
    const userCollection = database.collection("users");

    // save DATA
    router.post("/users", async (req, res) => {
      const user = req.body;

      console.log(user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // SAVE USER
    router.put("/users", async (req, res) => {
      const user = req.body;
      console.log("PUT", user);
      console.log(user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      console.log(result);
      res.json(result);
    });
    // UPADE USER
    router.put("/updated", async (req, res) => {
      const user = req.body;
      console.log(user);
      const options = { upsert: true };

      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(user, updateDoc, options);
      console.log(result);
      res.json(result);
    });

    // USE GET CREATE ADMIN
    router.put("/users/admin", verifyToken, async (req, res) => {
      const user = req.body;
      // console.log(("put", req.decodedEmail));

      const requeSter = req.decodedEmail;
      if (requeSter) {
        const reqStartAccount = await userCollection.findOne({
          email: requeSter,
        });
        if (reqStartAccount.role === "admin") {
          const filter = { email: user.email };
          const updateDoc = { $set: { role: "admin" } };
          const result = await userCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      } else {
        res
          .status(403)
          .json({ message: "you do not have access to make admin" });
      }
    });

    router.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    router.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const service = await cursor.toArray();
      // console.log(service)
      res.json(service);
    });
  } finally {
  }
}
User();
module.exports = router;
