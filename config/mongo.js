const { MongoClient } = require("mongodb");

// Replace the <username>, <password>, and <dbname> parts
const uri = "mongodb+srv://pratideep:pratideep@cluster1.qhhdrse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("✅ Connected to MongoDB cluster");

    // Access the database and collection
    const db = client.db("testDB");
    const collection = db.collection("testCollection");

    // Insert a document
    const result = await collection.insertOne({ name: "ChatGPT", type: "AI Bot" });
    console.log("Inserted document ID:", result.insertedId);

    // Read the document
    const doc = await collection.findOne({ name: "ChatGPT" });
    console.log("Found document:", doc);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}

run();
