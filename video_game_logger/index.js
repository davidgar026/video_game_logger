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

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    res.render("index.ejs");
})



const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://id.twitch.tv/oauth2/token',
            null,
            {
                params: {
                    client_id: 't4qpnrtaj5033n4aky50zbbdjvoo79',
                    client_secret: 'bkn6uhxfso0zbsu119p7x0ugf3p9nn',
                    grant_type: 'client_credentials'
                }
            })
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching token: ", error.response?.data || error.message);
    }
}


app.post("/get-games", async (req, res) => {
    const getToken = getAccessToken();

    if (!getToken) {
        return res.status(500).send('Unable to fetch access token.');
    }

    try {
        const response = await axios.post('https://api.igdb.com/v4/games',
            'fields name, genres.name, platforms.name, rating; limit 10;',
            {
                headers: {
                    'Client-ID': 't4qpnrtaj5033n4aky50zbbdjvoo79',
                    Authorization: 'Bearer 8xyzvu4tihr79a3hzz64wv6kwbmfhm'
                }
            }
        );
        console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from IGDB:', error.response?.data || error.message);
        res.status(500).send('Error fetching data from IGDB.');
    }
});







/*   



const getToken = async () => {
    try {
        const response = await axios.post("https://id.twitch.tv/oauth2/token",
            null,
            {
                params: {
                    client_id: 't4qpnrtaj5033n4aky50zbbdjvoo79',
                    client_secret: 'bkn6uhxfso0zbsu119p7x0ugf3p9nn',
                    grant_type: 'client_credentials'

                }
            }
        );
        console.log("Here is your token: ", response.data.access_token)
        return response.data.access_token;
    } catch (error) {

    }

};

const accessAPI = async () => {
    const token = await getToken();

    try {
        const response = await axios.post("https://api.igdb.com/v4/games",
            "fields name,rating, total_rating; where first_release_date > 1704088800 & first_release_date < 1735061958 & total_rating_count >= 20; sort total_rating desc;",
            {
                headers: {
                    'Client-ID': 't4qpnrtaj5033n4aky50zbbdjvoo79',
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log(response.data)
        return response.data
    }catch(error){

    }
}

const getData = accessAPI();

console.log(getData)




*/













app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})