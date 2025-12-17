const express = require("express");
const cors = require("cors");

const app = express();

/**
 * CORS toestaan voor alle origins (prima voor MVP)
 */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

/**
 * JSON body parsing
 */
app.use(express.json());

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("JobWave backend is running 🚀");
});

/**
 * Publish campaign endpoint (MVP)
 */
app.post("/publish-campaign", (req, res) => {
  console.log("Campaign data received:", req.body);

  res.json({
    success: true,
    message: "Campaign received"
  });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
