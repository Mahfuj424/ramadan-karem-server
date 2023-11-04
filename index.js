const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgokub5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allIftarCollection = client.db('ramadan-karem').collection('iftar');
    const allFavoriteCollection = client.db('ramadan-karem').collection('favorite');


    app.get('/iftar', async (req, res) => {
      const result = await allIftarCollection.find().toArray()
      res.send(result)
    });

    app.post('/addFavorite', async (req, res) => {
      const body = req.body;
      const result = await allFavoriteCollection.insertOne(body)
      res.send(result)
    })

    app.get('/favorite/:email', async (req, res) => {
      const email = req.params.email;
      const result = await allFavoriteCollection
        .find({ userEmail: email })
        .toArray()
      res.send(result)
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("ramadan server site is running");
});

app.listen(port, () => {
  console.log(`ramadan server site running on port ${port}`);
});


