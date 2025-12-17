const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

const META_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

// Health check
app.get("/", (req, res) => {
  res.send("JobWave backend is running 🚀");
});

// Publish campaign
app.post("/publish-campaign", async (req, res) => {
  try {
    const { company_name } = req.body;

    const campaignResponse = await fetch(
      `https://graph.facebook.com/v19.0/${AD_ACCOUNT_ID}/campaigns`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${META_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: company_name || "JobWave Test Campaign",
          objective: "LEAD_GENERATION",
          special_ad_categories: ["EMPLOYMENT"],
          status: "PAUSED"
        })
      }
    );

    const campaignData = await campaignResponse.json();

    if (campaignData.error) {
      return res.status(400).json(campaignData);
    }

    return res.json({
      success: true,
      campaign_id: campaignData.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backend error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

