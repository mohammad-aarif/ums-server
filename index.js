const express = require('express');
const cors = require('cors');

const port = 5000;
const app = express()


// Middleware 
app.use(cors())


// Home 
app.get('/', (req, res) => {
    res.send('Server Running...');
})




// Server Connection 
app.listen(port, () => {
    console.log("Server Connected!");
    
})