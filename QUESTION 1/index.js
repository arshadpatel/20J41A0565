import cors from "cors";
import express from "express";
import axios from "axios";

const app = express();
app.use(cors());

const api_data = {
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