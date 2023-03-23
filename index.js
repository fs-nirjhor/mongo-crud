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

// Add Data  
 app.post("/addProduct", async (req, res) => {
  try {
  	await client.connect();
    const collection = client.db("mongo-crud-data").collection("products");
   	const product = req.body ;
    const result = await collection.insertOne(product);
      console.log(product);
      res.send(product);
  } catch(error) {
  	console.log("Error:",error.code);
  } finally {
    await client.close();
  }
});

// Get All Data 
app.get("/products", async (req, res) => {
  try {
  	await client.connect();
    const collection = client.db("mongo-crud-data").collection("products");
    
   const cursor = collection.find();
   const products = await cursor.toArray();
   res.send(products);
  } catch(error) {
  	console.log("Error:",error.code);
  } finally {
    await client.close();
  }
});

//Get Single Data 
app.get("/products/:id", async (req, res) => {
	try {
  	await client.connect();
    const collection = client.db("mongo-crud-data").collection("products");
    
   const cursor = collection.find({_id: new ObjectId(req.params.id)});
   const products = await cursor.toArray();
   res.send(products[0]);
  } catch(error) {
  	console.log("Error:",error.code);
  } finally {
    await client.close();
  }
});

// Delete Data 
app.delete("/deleteProduct/:id", async (req, res) => {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("mongo-crud-data");
    const coll = db.collection("products");
    // delete code goes here
    const doc = {
      _id: new ObjectId(req.params.id)
      };
    const result = await coll.deleteOne(doc);
    console.log(result);
    res.send(result);
  } catch(error) {
  	console.log("Error:",error.code);
  } finally {
    await client.close();
  }
});


/* // Add data directly into database 
async function run() {
  try {
    const collection = client.db("mongo-crud-data").collection("products");
    // create a document to insert
    const product = {name: "potol", price: 30, quantity: 7};
    const result = await collection.insertOne(product);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
*/

app.listen(port);
