const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const admin = require("firebase-admin");
const app = express();
const port =  process.env.PORT || 5000;


// ADMIN


const serviceAccount = require('./education-web-admin-sdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});






const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload')


const stripe = require('stripe')(process.env.STRIPE_SECRITE)


app.use(cors());
app.use(express.json());
app.use(fileUpload());


// VERIFY TOKEN

async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();


}






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
const userCollection = database.collection('users')

const orders = database.collection('AllOrder')


// GET TEACHER
app.get("/teachers", async(req,res)=>{
    const cursor = teachersCollention.find({});
    // console.log(cursor)
    const teacher = await cursor.toArray()
    // console.log(teacher)
    res.send(teacher)
});

app.get("/teacher/:about", async (req, res) => {
    const id = req.params.about;
    const query = { _id: ObjectId(id) };
    const result = await teachersCollention.findOne(query);
    res.json(result);
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

app.get("/result/:ID", async (req, res) => {
    const id = req.params.ID;
    const query = { _id: ObjectId(id) };
    const result = await resultPublishCollection.findOne(query);
    res.json(result);
});






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
    // console.log('files',req.files)
    const pic = req.files.image;

const picData = pic.data;


const encidPic = picData.toString('base64')
const imageBaffer = Buffer.from(encidPic, 'base64');

// console.log(imageBaffer)
//     console.log('file',req.file);

const AllItem = 

{ admition, 

image:imageBaffer}
// console.log(AllItem)
  const result = await admitCollection.insertOne(AllItem)
  console.log(result);
  res.send(result)
  })
    
// DELETED ADMITION
app.delete("/deleteAdmition/:id", async (req, res) => {
    const result = await admitCollection.deleteOne({
        _id: ObjectId(req.params.id),
    });
    console.log(result)
    res.json(result);
});



//   single admition
app.get("/admition/:booking", async (req, res) => {
    const id = req.params.booking;
    const query = { _id: ObjectId(id) };
    const result = await admitCollection.findOne(query);
    res.json(result);
});

/* app.put('/admitions/:id', async (req, res) => {
    const id = req.params.id;
    const payment = req.body;
    const filter = { _id: ObjectId(id) };
    const updateDoc = {
        $set: {
            payment: payment
        }
    };
    const result = await appointmentsCollection.updateOne(filter, updateDoc);
    res.json(result);
})
 */



// order all
app.post('/orders',async(req,res)=>{
    const user = req.body;
    const result = await orders.insertOne(user);
    console.log(result)
    res.json(result);
})





// USER DATA
app.post('/users',async(req,res)=>{
    const user = req.body;
    const result = await userCollection.insertOne(user);
    console.log(result)
    res.json(result);
})

app.put('/users',async(req,res)=>{
    const user = req.body;
    const filter = {email: user.email};
    const options = {upsert:true};
    const updateDoc = {$set:user};
    const result = await userCollection.updateOne(filter,updateDoc,options);
    res.json(result)
})

app.put('/users/admin',verifyToken, async(req,res)=>{
    const user = req.body;
    console.log(('put', req.decodedEmail))


const requeSter = req.decodedEmail;
if(requeSter){
    const reqStartAccount = await userCollection.findOne({email:requeSter});
    if(reqStartAccount.role === 'admin'){

        const filter = {email: user.email};
        const updateDoc = {$set:{role:'admin'}};
        const result = await userCollection.updateOne(filter,updateDoc);
        res.json(result)
    }
}
else{res.status(403).json({message:'you do not have access to make admin'})}



    console.log(result)

})
app.get('/users/:email',async(req,res)=>{
    const email = req.params.email;
    const query = {email: email};
    const user = await userCollection.findOne(query);
let isAdmin = false;
    if(user?.role === 'admin'){
        isAdmin = true;
    }
    res.json({admin:isAdmin});
})




app.post('/create-payment-intent', async(req,res)=>{
    const paymentInfo = req.body;
    console.log(paymentInfo);
    const amount = paymentInfo.price * 100;
    const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
amount: amount,
automatic_payment_methods:['card']
  

    });

    res.json({  clientSecret: paymentIntent.client_secret,})
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

