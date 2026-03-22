const express = require('express');
const cors = require('cors');
const { ApifyClient } = require('apify-client');
const app = express();

app.use(cors());

// 你的 Apify Token（我已帮你填入）
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const client = new ApifyClient({ token: APIFY_TOKEN });

// 视频解析接口
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ success: false, error: "Please enter YouTube URL" });

    // 调用 Apify 官方 YouTube 下载器
    const run = await client.actor("kjernekode/youtube-downloader-api").call({
      videoUrl: url,
      format: "mp4"
    });

    // 获取结果
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    const video = items[0];

    return res.json({
      success: true,
      title: video.title,
      thumbnail: video.thumbnailUrl,
      duration: video.duration,
      mp4: video.downloadUrl,
      mp3: video.audioDownloadUrl || video.downloadUrl
    });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, error: "Parsing failed" });
  }
});

module.exports = app;
