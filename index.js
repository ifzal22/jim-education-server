const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port =  process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqdph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// FUNTION
async function run(){
    try{


    await client.connect();
    console.log('DATABASE CONNECTED SUCCESFULL')
const database = client.db('jim-education');
const teachersCollention = database.collection('teacherData');
const servicesCollection = database.collection('JIMservices')
const admitCollection = database.collection('Admition')

// GET TEACHER
app.get("/teachers", async(req,res)=>{
    const cursor = teachersCollention.find({});
    // console.log(cursor)
    const teacher = await cursor.toArray()
    // console.log(teacher)
    res.send(teacher)
});
// GET API
app.get('/services',async(req,res)=>{
    const cursor = servicesCollection.find({})
    const service = await cursor.toArray()
    // console.log(service)
    res.json(service)
})

// GET ADMITION
app.get('/admition',async(req,res)=>{
    const cursor = admitCollection.find({})
    const admit = await cursor.toArray()
    console.log(admit)
    res.json(admit)
})
    
    }
    finally{
        // await client.close();
    }
    }
    
    run().catch(console.dir);


app.get("/",(req, res)=>{
    res.send("HEllow world");
});


app.listen(port, () =>{
    console.log("Running server port");
});

