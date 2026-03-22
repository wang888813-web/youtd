const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// ==================== 你的 ZYLA API KEY ====================
const API_KEY = "12934|tlS49CLwKweh4tFinxj5jYPERcxIMSTTJ49w0";
// ===========================================================

// 解析接口（正确 Zyla 调用方式）
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ success: false, error: "Please enter URL" });

    // ✅ Zyla 正确请求地址 + 传参方式
    const { data } = await axios.get("https://api.zylalabs.com/YouTubeDownloadAndInfo", {
      params: {
        url: url,
        apikey: API_KEY  // ✅ 不是 Bearer！是直接传 apikey！
      }
    });

    // ✅ Zyla 正确返回字段
    return res.json({
      success: true,
      title: data.title || "YouTube Video",
      thumbnail: data.thumbnail || "",
      duration: data.duration || "0",
      mp4: data.download_url || "",
      mp3: data.download_url || ""
    });

  } catch (error) {
    console.error("ERROR", error.response?.data || error.message);
    return res.json({
      success: false,
      error: "Parsing failed, please try another video"
    });
  }
});

// 下载接口
app.get('/api/download', async (req, res) => {
  try {
    const { url } = req.query;
    const { data } = await axios.get("https://api.zylalabs.com/YouTubeDownloadAndInfo", {
      params: { url, apikey: API_KEY }
    });
    res.redirect(data.download_url);
  } catch (err) {
    res.status(500).send("Download error");
  }
});

module.exports = app;
