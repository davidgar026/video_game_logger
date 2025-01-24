import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import path from 'path';
const port = 3000;
const app = express();
let username;
let password;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "video_game_logger",
    password: "pimpin",
    port: 5432,
});

db.connect();

app.use(express.json());
app.use(express.static(path.join('C:/Web Development Projects/Backend/video_game_logger', 'public')));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));


const getAllUsers = async () => {
    const result = await db.query("SELECT * FROM users");
    console.log("user = ", result.rows[0]['username'])
}
app.get("/", (req, res) => {
    res.render("index.ejs");
})
app.get("/my-games", (req, res) => {
    res.render("my-games.ejs");
})
app.get("/log-a-game", (req, res) => {
    res.render("log-a-game.ejs");
})
app.get("/game-news", (req, res) => {
    res.render("game-news.ejs");
})
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})
app.get("/home_logged_in", (req, res) => {
    res.render("home_logged_in.ejs", {
        user: username
    });
})
app.post("/home_logged_in", (req, res) => {
    console.log("typed in username = ", username);
    res.render("home_logged_in.ejs", {
        user: username
    });
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
app.post("/add", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await db.query("INSERT INTO users (username,password) VALUES ($1,$2)", [username, password]);
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }

})
/*THIS IS WHERE YOU LEFTED OFF. YOU MADE A APP.POST TO RETRIEVE THE USER'S CREDENTIALS FROM index.ejs file. Next, youd like to make sure that whatever profile the user enters, it will log them into their file and display that in the header. (On the top far right if possible but if not, you can do that later) */
app.post("/log-in", async (req, res) => {
    const { username, password } = req.body;
    
    console.log('Received Body:', req.body);
    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        console.log("result = ", result)
        if (result.rows.length === 0 || result.rows[0].password !== password) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }
        const user = result.rows[0];
        console.log("user = ", user)
        return res.json({ success: true, username: user.username });
    } catch (err) {
        console.error("Error during login: ", err.message);
        return res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
});
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