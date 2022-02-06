const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port =  process.env.PORT || 5000;

const ObjectId = require('mongodb').ObjectId;
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
const admitCollection = database.collection('admitionALL')
const studentColllection = database.collection('students')
const resultPublishCollection = database.collection('result-publish');


// GET TEACHER
app.get("/teachers", async(req,res)=>{
    const cursor = teachersCollention.find({});
    // console.log(cursor)
    const teacher = await cursor.toArray()
    // console.log(teacher)
    res.send(teacher)
});

// ADD TEACHER

app.post('/addTeacher', async(req, res)=>{
    const service = req.body;
    console.log(service)
//    console.log('hit the post api', service);
  
  
  const result = await teachersCollention.insertOne(service)
  console.log(result);
  res.json(result)
  })


// GET STUDENT


app.get('/students',async(req,res)=>{
    const cursor = studentColllection.find({})
    const student = await cursor.toArray()
    // console.log(service)
    res.json(student)
})
// ADD STUDENT
app.post('/addStudent', async(req, res)=>{
    const service = req.body;
    console.log(service)

  const result = await studentColllection.insertOne(service)
  console.log(result);
  res.json(result)
  })

// GET API
app.get('/services',async(req,res)=>{
    const cursor = servicesCollection.find({})
    const service = await cursor.toArray()
    // console.log(service)
    res.json(service)
})


// POST SERVICES
app.post('/addServices', async(req, res)=>{
    const service = req.body;
    console.log(service)

  const result = await servicesCollection.insertOne(service)
  console.log(result);
  res.json(result)
  })

     // get single service
     app.get("/services/:ID", async (req, res) => {
        const id = req.params.ID;
        const query = { _id: ObjectId(id) };
        const result = await servicesCollection.findOne(query);
        res.json(result);
    });
// GET API
app.get('/results',async(req,res)=>{
    const cursor = resultPublishCollection.find({})
    const result = await cursor.toArray()
    // console.log(result)
    res.json(result)
})
// POST RESULT
app.post('/Addresult', async(req, res)=>{
    const admition = req.body;
    console.log(admition)

  const result = await resultPublishCollection.insertOne(admition)
  console.log(result);
  res.send(result)
  })
    


// GET ADMITION
app.get('/admition',async(req,res)=>{
    const cursor = admitCollection.find({});
    console.log(cursor)
    const admit = await cursor.toArray()
    console.log(admit)
    res.json(admit)
})

app.post('/AddAdmition', async(req, res)=>{
    const admition = req.body;
    console.log(admition)

  const result = await admitCollection.insertOne(admition)
  console.log(result);
  res.send(result)
  })
    

//   single admition
app.get("/admition/:booking", async (req, res) => {
    const id = req.params.booking;
    const query = { _id: ObjectId(id) };
    const result = await admitCollection.findOne(query);
    res.json(result);
});


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

