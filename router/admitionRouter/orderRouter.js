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
const stripe = require("stripe")(process.env.STRIPE_SECRITE);

const Order = async () => {
  try {
    await client.connect();
    const database = client.db("jim-education");
    const orders = database.collection("AllOrder");

    router.post("/create-payment-intent", async (req, res) => {
      const paymentInfo = req.body;
      console.log(paymentInfo);
      const amount = paymentInfo.price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        automatic_payment_methods: ["card"],
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    });
    // order all
    router.post("/orders", async (req, res) => {
      const user = req.body;
      const result = await orders.insertOne(user);
      console.log(result);
      res.json(result);
    });
  } finally {
  }
};
Order();
module.exports = router;
