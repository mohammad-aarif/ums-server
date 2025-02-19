const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {MongoClient , ServerApiVersion, ObjectId} =require('mongodb');

const port = 5000;
const app = express();


// Middleware 
app.use(cors())
app.use(express.json())


// Database connction 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fs6ek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const mongo = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})


async function run() {
    try{
        await mongo.connect()
        const database = mongo.db("UMS");
        const userCollection = database.collection("Users")

        // Getting User From DB 
        app.get('/users', async(req, res) => {
            const result = await userCollection.find().toArray();
            res.send(JSON.stringify(result))
        })
        // Sending Data to the Database 
        app.post('/users', async(req, res) =>{
            const userData = req.body
            const result = await userCollection.insertOne(userData)
            res.send(result);                       
        })
        // Deleting data from Database 
        app.delete('/users/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.dir);

// Home 
app.get('/', (req, res) => {
    res.send('Server Running...');
})




// Server Connection 
app.listen(port, () => {
    console.log("Server Connected!");
})