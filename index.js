const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

require('dotenv').config();
const {MongoClient , ServerApiVersion, ObjectId} =require('mongodb');

const port = 5000;
const app = express();


// Middleware 
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
app.use(express.json())
app.use(cookieParser())

const tokenVerify = (req, res, next) => {
    const token = req.cookies?.token
    if(!token){
        res.status(401).send({message: 'Unauthorized Access!'})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) =>{
        if(err){
            res.status(401).send({message: "Unauthorized Access"})
        }
        else{
            req.body = decode
            next()
        }
    })
}


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

        // Set JWT token  
        app.post('/jwt', (req, res)=>{
            const data = req.body 
            const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '1h'})
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
            }).send({success: true})
        })
        // Remove JWT token
        app.post('/logout', (req, res) => {
            res
                .clearCookie('token', {
                    httpOnly: true,
                    secure: false,
                })
                .send({success: true})
        })
        

        // Getting User From DB 
        app.get('/users', async(req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const result = await userCollection.find().skip(page*size).limit(size).toArray();
            res.send(JSON.stringify(result))
        })
        app.get('/userscount', async(req, res) => {
            const usersCount = await userCollection.estimatedDocumentCount()
            res.send({usersCount})
        })


        // Sending Data to the Database 
        app.post('/users', async(req, res) =>{
            const userData = req.body
            const result = await userCollection.insertOne(userData)
            res.send(result);                       
        })
        // Deleting data from Database 
        app.get('/users/view/:id', tokenVerify, async(req, res) => {
            const id = req.params.id
            const data = req.body?.email
            if(data !== id) {
                res.status(401).send({message: "Your Are Unauthorzed"})
            }
            else{
            const query = {email: id}
            const result = await userCollection.find(query).toArray()
            res.send(result)}
        })
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