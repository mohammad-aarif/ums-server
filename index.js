const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {MongoClient , ServerApiVersion} =require('mongodb');

const port = 5000;
const app = express();


// Middleware 
app.use(cors())


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