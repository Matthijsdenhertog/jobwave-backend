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

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("JobWave backend is running 🚀");
});

/**
 * Publish campaign
 */
app.post("/publish-campaign", async (req, res) => {
  console.log("🚀 Publish campaign called");
  console.log("📦 Request body:", req.body);

  try {
    const { company_name } = req.body;

    if (!company_name) {
      console.log("❌ company_name ontbreekt");
      return res.status(400).json({ error: "company_name ontbreekt" });
    }

    /* ======================
       1. CREATE CAMPAIGN
    ====================== */
    console.log("➡️ Creating Meta campaign...");

    const campaignResponse = await fetch(
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

    const campaignData = await campaignResponse.json();
    console.log("📩 Campaign response:", campaignData);

    if (!campaignData.id) {
      console.log("❌ Campaign creation failed");
      return res.status(500).json({
        error: "Campaign aanmaken mislukt",
        meta_error: campaignData
      });
    }

    /* ======================
       2. CREATE AD SET
    ====================== */
    console.log("➡️ Creating Ad set...");

    const adSetResponse = await fetch(
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
          daily_budget: 1000, // €10 per dag
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

    const adSetData = await adSetResponse.json();
    console.log("📩 Ad set response:", adSetData);

    if (!adSetData.id) {
      console.log("❌ Ad set creation failed");
      return res.status(500).json({
        error: "Ad set aanmaken mislukt",
        meta_error: adSetData
      });
    }

    console.log("✅ Campaign + Ad set created");

    return res.json({
      success: true,
      campaign_id: campaignData.id,
      adset_id: adSetData.id
    });

  } catch (err) {
    console.error("❌ UNEXPECTED ERROR:", err);
    return res.status(500).json({
      error: "Backend error",
      details: err.message
    });
  }
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
