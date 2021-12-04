const express = require("express");
const cors = require("cors")
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gnvic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("rider-gear");
      const bikesCollection = database.collection("bikes");
      const ordersCollection = database.collection("orders");
      const reviewCollection = database.collection("review");
      const usersCollection = database.collection("users");
        console.log("database connected")
      // create a document to insert

    // Get all bikes

        app.get("/bikes", async(req, res)=>{
            const cursor = bikesCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })


    //   Get Bike by id

        app.get("/bikes/:id", async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await bikesCollection.findOne(query)
            res.json(result);
        })

    // Post orders

        app.post("/order", async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

    // Get orders by email
        app.get("/orders", async(req, res)=>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = ordersCollection.find(query)
            const result = await cursor.toArray()
            res.json(result)
        })
    // Delete orders by id
        app.delete("/orders/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await ordersCollection.deleteOne(query)
            res.json(result);
        })

    // Post review
        app.post("/review", async(req, res)=>{
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview)
            res.json(result)
        })

    // Get review
        app.get("/review", async(req, res)=>{
            const cursor = reviewCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })
    //   Post user to db
        app.post("/users", async(req, res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })

        app.get("/users/:email", async(req, res)=>{
            const email = req.params.email
            const query = {email: email}
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if(user?.role === 'admin'){
                isAdmin = true
            }
            res.json({admin : isAdmin})
        })
      
        app.put('/users', async(req,res)=>{
            const user = req.body;
            const filter = {email: user.email}
            const options = {upsert: true}
            const updateDoc = {
              $set: user
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
          })

          app.put("/users/admin", async(req, res)=>{
              const user = req.body;
              const filter = {email: user.email}
              const updateDoc = {
                  $set: {role: 'admin'}
              }
              const result = await usersCollection.updateOne(filter, updateDoc)
              res.json(result)
          })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("hello moto")
})

app.listen(port, ()=>{
    console.log("Listening to the port", port)
})