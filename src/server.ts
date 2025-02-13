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
  const { accountName } = req.query;
  if (!accountName) {
    return res.status(400).json({ error: "Missing accountName" });
  }

  try {
    // const encodedAccountName = encodeURIComponent(accountName)
    const response = await axios.get(`${POE_BASE_URL}/character-window/get-characters`, {
      params: { accountName },
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
