const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// 你的 Zyla API Key（完整正确）
const API_KEY = "12934|tlS49CLwKweh4tFinxj5jYPERcxIMSTTJ49w0knm";

// 主解析接口（自动处理异步进度）
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ success: false, error: "Please enter URL" });

    // ========== 第一步：提交任务 ==========
    const taskRes = await axios({
      method: 'GET',
      url: 'https://zylalabs.com/api/11016/youtube+download+and+info+api/20761/download',
      headers: { 'Authorization': 'Bearer ' + API_KEY },
      params: { url, format: 'mp4' }
    });

    const progressUrl = taskRes.data.progress_url;
    const thumbnail = taskRes.data.image;

    if (!progressUrl) return res.json({ success: false, error: "Error" });

    // ========== 第二步：循环查进度 ==========
    let downloadLink = null;
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 1500));
      const progress = await axios.get(progressUrl);

      if (progress.data.status === "finished") {
        downloadLink = progress.data.download_link;
        break;
      }
    }

    if (!downloadLink) {
      return res.json({ success: false, error: "Processing timeout" });
    }

    // ========== 第三步：返回给前端 ==========
    return res.json({
      success: true,
      title: "YouTube Video",
      thumbnail: thumbnail,
      mp4: downloadLink,
      mp3: downloadLink
    });

  } catch (err) {
    console.error(err.message);
    return res.json({ success: false, error: "Parsing failed" });
  }
});

// 下载接口
app.get('/api/download', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL missing");

    const task = await axios({
      method: 'GET',
      url: 'https://zylalabs.com/api/11016/youtube+download+and+info+api/20761/download',
      headers: { 'Authorization': 'Bearer ' + API_KEY },
      params: { url, format: 'mp4' }
    });

    let link = null;
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 1500));
      const p = await axios.get(task.data.progress_url);
      if (p.data.status === "finished") {
        link = p.data.download_link;
        break;
      }
    }

    if (!link) return res.status(500).send("Timeout");
    res.redirect(link);

  } catch (e) {
    res.status(500).send("Error");
  }
});

module.exports = app;
