const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

const API_KEY = "12934|tlS49CLwKweh4tFinxj5jYPERcxIMSTTJ49w0knm";
const API_URL = "https://zylalabs.com/api/11016/youtube+download+and+info+api/20761/download";

// 1. 创建下载任务（只提交，不等待）
app.get('/api/create-task', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.json({ success: false, error: "Missing URL" });

    const { data } = await axios({
      method: 'GET',
      url: API_URL,
      headers: { Authorization: `Bearer ${API_KEY}` },
      params: { url, format: "mp4" }
    });

    return res.json({
      success: true,
      progress_url: data.progress_url,
      thumbnail: data.image
    });
  } catch (err) {
    return res.json({ success: false, error: "Task failed" });
  }
});

// 2. 查询进度（前端轮询用）
app.get('/api/check-progress', async (req, res) => {
  try {
    const { url } = req.query;
    const { data } = await axios.get(url);
    return res.json(data);
  } catch (err) {
    return res.json({ status: "error" });
  }
});

module.exports = app;
