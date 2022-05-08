const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running Automobile Server");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tazsd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const carsCollection = client.db("automobiles").collection("vehicles");
    const addedCollection = client.db("automobiles").collection("addedItem");

    console.log("db connected");
    //-----------
    //GET DATA
    //----------
    app.get("/cars", async (req, res) => {
      const query = {};
      const cursor = carsCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cars = await carsCollection.findOne(query);
      res.send(cars);
    });
    // ------------
    // POST DATA
    //-------------
    app.post("/cars", async (req, res) => {
      const addedItem = req.body;
      const result = await carsCollection.insertOne(addedItem);
      res.send(result);
    });
    // app.patch("/cars/:id", async (req, res) => {
    //   const data = req.params.id;
    //   const result = await carsCollection.insertOne(data);
    //   res.send(result);
    // });

    //------------
    //DELETE DATA
    //------------

    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.deleteOne(query);
      res.send(result);
    });

    // Added Collection Api

    // Get Data

    app.get("/addItems", async (req, res) => {
      const query = {};
      const cursor = addedCollection.find(query);
      const services = await cursor.toArray();
      res.json(services);
    });

    // Post data

    app.post("/addItems", async (req, res) => {
      const addedItem = req.body;
      const result = await addedCollection.insertOne(addedItem);
      res.send(result);
    });

    // Delete added Data
    app.delete("/addItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addedCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening to the port", port);
});
