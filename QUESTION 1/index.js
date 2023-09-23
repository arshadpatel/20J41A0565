const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());

const apiData = {
    "companyName": "Train Central",
    "clientID": "4d490bd2-a668-4fd6-ac2f-bd6371dae8b6",
    "clientSecret": "rnydWVgFSyrGpGuc",
    "ownerName": "Arshad Mahemood Patel",
    "ownerEmail": "arshad.amp432@gmail.com",
    "rollNo": "20J41A0565"
}
let auth_token = "";
async function getToken(api_data) {
    try {
        const response = await axios.post("http://20.244.56.144/train/auth", api_data);
        const token = response.data.access_token;
        return token;
    }
    catch (error) {
        console.error("Error : ", error);
        throw error;
    }
}

setInterval(async () => {
    auth_token = await getToken(apiData);
}, 30000);

async function fetchTrains() {
    const AUTH = await getToken(apiData);
    try {
        const headers = {
            Authorization: `Bearer ${AUTH}`,
        };
        const res = await axios.get("http://20.244.56.144/train/trains", {headers,});
        const trainsData = res.data;
        return trainsData;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

function sortingTrains(trains_data) {
    function customSort(a, b) {
        const priceComp = a.price.AC - b.price.AC;
        if (priceComp !== 0) {
            return priceComp;
        }
        const seatsAvailable = b.seatsAvailable.AC - a.seatsAvailable.AC;
        if (seatsAvailable !== 0) {
            return seatsAvailable;
        }

        const departureTime1 = a.departureTime.Hours * 60 + a.departureTime.Minutes;
        const departureTime2 = b.departureTime.Hours * 60 + b.departureTime.Minutes;
        return departureTime2 - departureTime1;
    }

    for (let i = 0; i < trains_data.length - 1; i++) {
        for (let j = 0; j < trains_data.length - i - 1; j++) {
            if (customSort(trains_data[j], trains_data[j + 1]) > 0) {
                const temp = trains_data[j];
                trains_data[j] = trains_data[j + 1];
                trains_data[j + 1] = temp;
            }
        }
    }

    const sortedTrains = [];
    for (const train of trains_data) {
        if (train.departureTime.Minutes > 30) {
            sortedTrains.push(train);
        }
    }
    return sortedTrains;
}

app.get("/", async (req, res) => {
    try {
        const trainsData = await fetchTrains();
        const sorting = sortingTrains(trainsData);
        res.json(sorting);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/getTrain/:trainId", async (req, res) => {
    try {
        const trainNumber = req.params.trainId;
        const AUTH = await getToken(apiData);

        const headers = {
            Authorization: `Bearer ${AUTH}`,
        };

        const trainData = await axios.get(
            `http://20.244.56.144/train/trains/${trainNumber}`,
            { headers }
        );
        res.json(trainData.data);
    } catch (error) {
        console.error("Error : ", error);
        res.status(500).json({ error: "Try Again" });
    }
});

app.listen(8080, () => {
    console.log("Server is running on port http://localhost:8080");
});