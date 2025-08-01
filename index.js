import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import path from 'path';
import fetch from "node-fetch"; // Make sure you have `node-fetch` installed

const port = process.env.PORT || 3000;
const app = express();
dotenv.config();

// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost", // Replace with Railway's host
//     database: "video_game_logger", // Use Railway's database name
//     password: "pimpin", // Use Railway's password
//     port: 5432, // Use Railway's port
// });

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, //Required by Railway
    }
});
console.log("🔍 DATABASE_URL =======> ", process.env.DATABASE_URL);
db.connect()
  .then(() => console.log("✅ Connected to Railway DB"))
  .catch((err) => console.error("❌ DB connection error:", err));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));


//Capture all game data from database
async function loggedGames() {
    const result = await db.query("SELECT * FROM video_game_reviews");
    const games = result.rows;
    let gamesLogged = [];
    games.forEach((game) => {
        gamesLogged.push(game);
    })
    return gamesLogged;
}

app.get("/", async (req, res) => {
    const currentGamesLogged = await loggedGames();

    console.log("ALL GAMES LOGGED ARE SHOWING");
    res.render("index.ejs", {
        games: currentGamesLogged
    })

})

app.post("/add", async (req, res) => {
    console.log("req.bod = ", req.body);
    let gameName = req.body.gameName;
    let gameRating = req.body.rating;
    let gameUrl = req.body.gameUrl.replace(/\/t_thumb\//,"/t_cover_big/");;
    let gameText = req.body.textReview;

    console.log("gameName = ", gameName, ", gameRating = ", gameRating, ", game review = ", gameText, "game url = ", gameUrl);
    try {
        await db.query("INSERT INTO video_game_reviews (game_name, rating, review_text, game_cover) VALUES ($1,$2,$3,$4)", [gameName, gameRating, gameText, gameUrl])
        res.redirect("/")
    } catch (err) {
        console.log(err)
    }

})

app.post("/edit", async (req, res) => {
    console.log("req.bod = ", req.body);
    const { editItem, gameId } = req.body;
    if (!editItem) {
        console.log("Error: No review provided");
        return res.status(400).send("Error: No review provided");
    }
    try {
        // TODO: Update the database with the new review
        console.log("Updated review:", editItem);
        console.log("Associated ID of the game: ", gameId);

        await db.query("UPDATE video_game_reviews SET review_text = ($1) WHERE id = $2", [editItem, gameId]);
    } catch (err) {
        console.log(err)
    }

    res.redirect("/");
});


app.post("/delete", async(req, res) => {
    console.log("this is the delete route. req.bod = ", req.body);
    const { gameId } = req.body;
try{
    await db.query("DELETE FROM video_game_reviews WHERE id = $1", [gameId]);
    res.redirect("/");
}catch(err){
    console.log(err);
}
});

const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://id.twitch.tv/oauth2/token',
            null,
            {
                params: {
                    client_id: 't4qpnrtaj5033n4aky50zbbdjvoo79',
                    client_secret: 'qq5lmh5bhhpxb382xprmam3p2ihzkx',
                    grant_type: 'client_credentials'
                }
            })
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching token: ", error.response?.data || error.message);
    }
}

//Route to access external API for game data
app.get("/api/games", async (req, res) => {
    const getToken = await getAccessToken();

    if (!getToken) {
        return res.status(500).send('Unable to fetch access token.');
    }
    try {
        const apiResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST", // IGDB requires POST requests
            headers: {
                "Client-ID": 't4qpnrtaj5033n4aky50zbbdjvoo79',
                Authorization: `Bearer ${getToken}`,
                "Content-Type": "text/plain" // IGDB requires plain text, not JSON
            },
            body: `fields name, rating, total_rating,screenshots.url, cover.*; search "${req.query.search}";` // This must be a raw string
        });
        if (!apiResponse.ok) {
            throw new Error("Failed to fetch from API");
        }
        const data = await apiResponse.json();
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
