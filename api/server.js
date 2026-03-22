const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

const APIFY_TOKEN = "apify_api_szxNc9j8t1TVNeXwgbxuzDb7HM28wg0OmuGR";

app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ success: false, error: "no url" });

    const { data } = await axios.post(
      "https://api.apify.com/v2/acts/streamers~youtube-video-downloader/run-sync-get-dataset-items",
      { videoUrl: url },
      { params: { token: APIFY_TOKEN } }
    );

    const v = data[0];
    res.json({
      success: true,
      title: v.title,
      thumbnail: v.thumbnailUrl,
      mp4: v.downloadUrl,
      mp3: v.audioDownloadUrl || v.downloadUrl
    });

  } catch (e) {
    res.json({ success: false, error: "fail" });
  }
});

module.exports = app;
