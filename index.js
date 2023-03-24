const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = 3000;
const password = "KXUE2O0QxiWIb3QD";
const uri =
  "mongodb+srv://farhan:KXUE2O0QxiWIb3QD@mongo-crud.knwr8sy.mongodb.net/mongo-crud-data?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Html Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// MongoDB
async function run() {
  try {
    client.connect();
    const collection = client.db("mongo-crud-data").collection("products");
    // Add Data
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await collection.insertOne(product);
      console.log(product);
      res.redirect("/");
    });
    // Get All Data
    app.get("/products", async (req, res) => {
      const cursor = collection.find();
      const products = await cursor.toArray();
      res.send(products);
    });
    //Get Single Data
    app.get("/products/:id", async (req, res) => {
      const cursor = collection.find({ _id: new ObjectId(req.params.id) });
      const products = await cursor.toArray();
      res.send(products[0]);
    });
    // Delete Data
    app.delete("/deleteProduct/:id", async (req, res) => {
      const doc = {
        _id: new ObjectId(req.params.id),
      };
      const result = await collection.deleteOne(doc);
      console.log(result);
      res.send(result);
    });
    // Update Single Data
    app.patch("/update/:id", async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const updateDoc = {
        $set: {
          price: req.body.price,
          quantity: req.body.quantity,
        },
      };
      const result = await collection.updateOne(filter, updateDoc);
      console.log(result);
      res.send(result);
    });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
