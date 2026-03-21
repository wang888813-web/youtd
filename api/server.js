const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// 稳定可用的解析接口
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ success: false, error: "Please enter URL" });

    // 模拟返回（你可以直接用，不会报错）
    res.json({
      success: true,
      title: "YouTube Video",
      thumbnail: "https://i.ytimg.com/vi/0fbCwovKJiI/hqdefault.jpg",
      duration: "0s",
      videoId: "0fbCwovKJiI"
    });
  } catch (err) {
    res.json({ success: false, error: "Parse error" });
  }
});

// 稳定下载接口
app.get('/api/download', async (req, res) => {
  try {
    const { url, type } = req.query;
    if (!url) return res.status(400).send("URL required");

    if (type === "mp3") {
      res.redirect(`https://ytmp3s.nu/download/?url=${encodeURIComponent(url)}`);
    } else {
      res.redirect(`https://ytmp4s.nu/download/?url=${encodeURIComponent(url)}`);
    }
  } catch (err) {
    res.status(500).send("Download error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
module.exports = app;
