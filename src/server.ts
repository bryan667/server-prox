import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5158;
const POE_BASE_URL = process.env.POE_BASE_URL

app.use(cors());
app.use(express.json());

app.get(`/api/poeOne/getItems`, async (req: any, res: any) => {
  const { accountName, character } = req.query;
  if (!accountName || !character) {
    return res.status(400).json({ error: "Missing accountName or character" });
  }

  try {
    const response = await axios.get(`${POE_BASE_URL}/character-window/get-items`, {
      params: { accountName, character },
      headers: {
        "User-Agent": "PoETrackerTest/1.0 (janbryanmartirez@gmail.com)"
      },
    });
    res.json(response.data);
  } catch (error: any) {
    const errCode = error?.code || "401"
    const errorMsgMan = error?.message || "Failed to fetch items"
    res.status(500).json({ error: errorMsgMan, errorCode: errCode });
  }
});

app.get(`/api/poeOne/getCharacters`, async (req: any, res: any) => {
  const { accountName, realm } = req.query;
  if (!accountName) {
    return res.status(400).json({ error: "Missing accountName" });
  }

  try {
    // const encodedAccountName = encodeURIComponent(accountName)
    const params: {accountName: string, realm?: string}= { accountName }
    if (realm) {
      params.realm = realm
    }
    const response = await axios.get(`${POE_BASE_URL}/character-window/get-characters`, {
      params,
      headers: {
        "User-Agent": "PoETrackerTest/1.0 (janbryanmartirez@gmail.com)"
      },
    });
    res.json(response.data);
  } catch (error: any) {
    const errCode = error?.code || "401"
    const errorMsgMan = error?.message || "Failed to fetch characters"
    res.status(500).json({ error: errorMsgMan, errorCode: errCode});
  }
});

app.get("/api/rsvp-status", async (req: any, res: any) => {
  const SHEET_ID = process.env.SHEET_ID;
  const SHEET_NAME = process.env.SHEET_NAME;
  const API_KEY = process.env.API_KEY;

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!G291?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const totalGuests = data.values?.[0]?.[0] ? parseInt(data.values[0][0], 10) : 0;
    res.json({ totalGuests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch RSVP status" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
