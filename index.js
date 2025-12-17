const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const META_API_VERSION = "v19.0";

// Health check
app.get("/", (req, res) => {
  res.send("JobWave backend is running 🚀");
});

// Publish campaign
app.post("/publish-campaign", async (req, res) => {
  console.log("🚀 Publish campaign called");
  console.log("📦 Request body:", req.body);

  try {
    const { company_name } = req.body;

    if (!company_name) {
      return res.status(400).json({ error: "company_name ontbreekt" });
    }

    // 1. CREATE CAMPAIGN (BELANGRIJK: act_)
    const campaignResponse = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/act_${META_AD_ACCOUNT_ID}/campaigns`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: `${company_name} – Vacaturecampagne`,
          objective: "LEAD_GENERATION",
          special_ad_categories: ["EMPLOYMENT"],
          status: "PAUSED"
        })
      }
    );

    const campaignData = await campaignResponse.json();
    console.log("📩 Meta campaign response:", campaignData);

    if (!campaignData.id) {
      return res.status(500).json({
        error: "Campaign creation failed",
        meta_error: campaignData
      });
    }

    return res.json({
      success: true,
      campaign_id: campaignData.id
    });

  } catch (err) {
    console.error("❌ Backend error:", err);
    return res.status(500).json({
      error: "Backend error",
      details: err.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

