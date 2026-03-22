const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// ==================== 你的 ZYLA API KEY ====================
const API_KEY = "12934|tlS49CLwKweh4tFinxj5jYPERcxIMSTTJ49w0knm";
// ===========================================================

// 解析视频 + 获取下载地址（完全按官方 curl 写的）
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ success: false, error: "Please enter URL" });

    // ✅ 完全按照你给的 curl 命令写的！1:1复刻
    const response = await axios({
      method: 'GET',
      url: 'https://zylalabs.com/api/11016/youtube+download+and+info+api/20761/download',
      headers: {
        'Authorization': 'Bearer ' + API_KEY  // ✅ 官方要求：Bearer + Key
      },
      params: {
        url: url,       // 视频链接
        format: 'mp4'   // 格式 mp4
      }
    });

    const data = response.data;

    return res.json({
      success: true,
      title: data.title || "YouTube Video",
      thumbnail: data.thumbnail || "",
      duration: data.duration || "0",
      mp4: data.downloadLink || "",
      mp3: data.downloadLink || ""
    });

  } catch (error) {
    console.error("错误:", error.response?.data || error.message);
    return res.json({ success: false, error: "Parsing failed, try another video" });
  }
});

// 下载接口
app.get('/api/download', async (req, res) => {
  try {
    const { url, type } = req.query;
    const format = type || 'mp4';

    const { data } = await axios({
      method: 'GET',
      url: 'https://zylalabs.com/api/11016/youtube+download+and+info+api/20761/download',
      headers: { 'Authorization': 'Bearer ' + API_KEY },
      params: { url, format }
    });

    res.redirect(data.downloadLink);

  } catch (err) {
    res.status(500).send("Download error");
  }
});

module.exports = app;
