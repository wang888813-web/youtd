const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// ==================== 你的 ZYLA API KEY ====================
const API_KEY = "12934|tlS49CLwKweh4tFinxj5jYPERcxIMSTTJ49w0";
// ===========================================================

// 统一错误处理的解析接口
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.json({ success: false, error: "Please enter YouTube URL" });
    }

    // 调用 Zyla API
    const response = await axios({
      method: 'GET',
      url: 'https://api.zylalabs.com/YouTubeDownloadAndInfo',
      headers: {
        'Authorization': 'Bearer ' + API_KEY
      },
      params: {
        url: url
      },
      timeout: 15000
    });

    const data = response.data;

    // 返回前端能识别的格式
    return res.json({
      success: true,
      title: data.title || 'YouTube Video',
      thumbnail: data.thumbnail || '',
      duration: (data.duration || 0) + 's',
      mp4: data.downloadUrls?.mp4 || '',
      mp3: data.downloadUrls?.mp3 || ''
    });

  } catch (error) {
    console.error('API Error:', error.message);
    // 返回友好错误，不爆500
    return res.json({
      success: false,
      error: "Parsing failed, please try another video"
    });
  }
});

// 下载接口
app.get('/api/download', async (req, res) => {
  try {
    const { url, type } = req.query;
    if (!url) return res.status(400).send("URL required");

    const { data } = await axios.get('https://api.zylalabs.com/YouTubeDownloadAndInfo', {
      headers: { 'Authorization': 'Bearer ' + API_KEY },
      params: { url }
    });

    const link = type === 'mp3' ? (data.downloadUrls?.mp3 || '') : (data.downloadUrls?.mp4 || '');
    if (!link) return res.status(404).send("Download link not available");

    return res.redirect(link);

  } catch (err) {
    return res.status(500).send("Download service error");
  }
});

module.exports = app;
