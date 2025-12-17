const express = require("express");
const cors = require("cors");

const app = express();

// Sta requests toe vanaf overal (voor MVP / Lovable)
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("JobWave backend is running 🚀");
});

app.post("/publish-campaign", async (req, res) => {
  console.log("Campaign data received:", req.body);

  return res.json({
    success: true,
    message: "Campaign received (Meta call komt later)"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

