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