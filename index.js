const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const META_API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

app.get("/", (req, res) => {
  res.send("JobWave backend is running 🚀");
});

app.post("/publish-campaign", async (req, res) => {
  try {
    const { company_name } = req.body;

    if (!company_name) {
      return res.status(400).json({ error: "company_name ontbreekt" });
    }

    // 1. Campaign
    const campaignRes = await fetch(
      `${BASE_URL}/act_${AD_ACCOUNT_ID}/campaigns`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: `${company_name} – Vacaturecampagne`,
          objective: "OUTCOME_LEADS",
          status: "PAUSED",
          special_ad_categories: ["EMPLOYMENT"]
        })
      }
    );

    const campaignData = await campaignRes.json();
    if (!campaignData.id) {
      return res.status(500).json(campaignData);
    }

    // 2. Ad set (tijdelijk LANDelijk, vaste waarden)
    const adSetRes = await fetch(
      `${BASE_URL}/act_${AD_ACCOUNT_ID}/adsets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: `${company_name} – Adset 1`,
          campaign_id: campaignData.id,
          daily_budget: 1000,
          billing_event: "IMPRESSIONS",
          optimization_goal: "LEAD_GENERATION",
          bid_strategy: "LOWEST_COST_WITHOUT_CAP",
          targeting: {
            geo_locations: { countries: ["NL"] }
          },
          status: "PAUSED"
        })
      }
    );

    const adSetData = await adSetRes.json();
    if (!adSetData.id) {
      return res.status(500).json(adSetData);
    }

    return res.json({
      success: true,
      campaign_id: campaignData.id,
      adset_id: adSetData.id
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
