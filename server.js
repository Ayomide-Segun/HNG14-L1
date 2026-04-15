const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const route = require('./route');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}))

app.use("/api", route);


    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully")) 
    .catch( (error) => {
        console.log(error);
        process.exit(1);
    })


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`The server is running on port ${PORT}`))