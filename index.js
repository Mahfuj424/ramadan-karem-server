const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const socketIo = require("socket.io");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const WebSocketServer = require('websocket').server;
const port = 5000 || process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New connection",);
  socket.on('disconnect', () => {
    console.log('disconnect');
  })
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgokub5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allIftarCollection = client.db("ramadan-karem").collection("iftar");
    const allFavoriteCollection = client.db("ramadan-karem").collection("favorite");
    const allHadisCollection = client.db("ramadan-karem").collection("hadis");

    app.get("/iftar", async (req, res) => {
      const result = await allIftarCollection.find().toArray();
      res.send(result);
    });

    app.get('/hadis', async(req, res) => {
      const result = await allHadisCollection.find().toArray();
      res.send(result)
    })
    

    app.post("/addFavorite", async (req, res) => {
      const body = req.body;
      const result = await allFavoriteCollection.insertOne(body);
      res.send(result);
    });

    app.get("/favorite/:email", async (req, res) => {
      const email = req.params.email;
      const result = await allFavoriteCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    app.delete('/deleteFavorite/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allFavoriteCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
  console.log(`ramadan server site running on port http://localhost:${port}`);
});
