import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";

const port = 3000;
const app = express();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "pimpin",
    port: 5432,
});


db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/my-games", (req,res) => {
    res.render("my-games.ejs");
})

app.get("/log-a-game", (req,res) => {
    res.render("log-a-game.ejs");
})

app.get("/game-news", (req,res) => {
    res.render("game-news.ejs");
})


const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://id.twitch.tv/oauth2/token',
            null,
            {
                params: {
                    client_id: 't4qpnrtaj5033n4aky50zbbdjvoo79',
                    client_secret: 'v6pyswcvnm519qqoy3z2s7b0ghz02i',
                    grant_type: 'client_credentials'
                }
            })
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching token: ", error.response?.data || error.message);
    }
}


app.post("/get-games", async (req, res) => {
    const getToken = await getAccessToken();
    const gameName = req.body.gameName;
    const retrievedGames = [];

    if (!getToken) {
        return res.status(500).send('Unable to fetch access token.');
    }

    try {
        const response = await axios.post('https://api.igdb.com/v4/games',
            `fields name,rating, total_rating; search "${gameName}";`,
            {
                headers: {
                    'Client-ID': 't4qpnrtaj5033n4aky50zbbdjvoo79',
                    Authorization: `Bearer ${getToken}`
                }
            }
        );

        const data = response.data;

        console.log("Number of entries: ", data.length, ", Data: ", data)


        data.forEach(el => {
            retrievedGames.push(el.name);
        })

        res.render("results.ejs", {
            gameOptions: retrievedGames,
        })
        
        

    } catch (error) {
        console.error('Error fetching data from IGDB:', error.response?.data || error.message);
        res.status(500).send('Error fetching data from IGDB.');
    }
});








app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})