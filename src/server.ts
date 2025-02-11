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
    // const encodedAccountName = encodeURIComponent(accountName)
    const response = await axios.get(`${POE_BASE_URL}/character-window/get-items`, {
      params: { accountName, character },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
    });
    res.json(response.data);
  } catch (error: any) {
    const errorMsgMan = error?.code + " " + error?.message || "Failed to fetch items"
    res.status(500).json({ error: errorMsgMan });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
