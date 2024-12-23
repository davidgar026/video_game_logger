import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const port = 3000;
const app = express();

/*
app.post("/", async (req, res) => {
    try{
        await axios.post("URL", body, config);
        res.sendStatus(201);
    }catch(error){
        res.status(404).send(error.response.data);
    }
});

*/

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {

    res.render("index.ejs");
})


app.post("/get-games", async(req, res) => {
    try{
        const result = await axios.post("https://api.igdb.com/v4/games/?fields=name", {
            BODY: "fields name, rating where id=302156;"
        }, {
            headers: {
                'Client-ID': 't4qpnrtaj5033n4aky50zbbdjvoo79',
                Authorization: 'Bearer bh5qbzhdnkhsagry5uje9sz7lxsf77'
            }
        });

        /*
        res.render("index.ejs", {
            text: result.data,
        })
            */
        console.log("result = ", result.data);
    }catch(error){
        res.status(404).send(error.response.data);
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})