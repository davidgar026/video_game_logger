import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const port = 3000;
const app = express();






app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})