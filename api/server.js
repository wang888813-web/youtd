const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// 你的 Apify Token
const APIFY_TOKEN = "apify_api_szxNc9j8t1TVNeXwgbxuzDb7HM28wg0OmuGR";

// 最简接口，永不 500
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.json({ success: false, error: "Please enter URL" });
    }

    // Apify 原生 API 调用（无 SDK，最轻量）
    const { data } = await axios.post(
      "https://api.apify.com/v2/acts/streamers~youtube-video-downloader/run-sync-get-dataset-items",
      { videoUrl: url },
      {
        params: { token: APIFY_TOKEN },
        timeout: 10000
      }
    );

    const video = data[0];
    res.json({
      success: true,
      title: video.title || "YouTube Video",
      thumbnail: video.thumbnailUrl || "",
      mp4: video.downloadUrl || "",
      mp3: video.audioDownloadUrl || video.downloadUrl || ""
    });

  } catch (err) {
    console.error(err);
    // 永远返回合法 JSON，不 500
    res.json({
      success: false,
      error: "Parsing failed, try again"
    });
  }
});

module.exports = app;
