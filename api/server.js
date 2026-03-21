const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

app.use(cors());

// 视频信息接口
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ success: false, error: "No URL" });

    const ytdlPath = require('path').join(__dirname, '../node_modules/ytdl-core/bin/ytdl-core');
    const cmd = `node "${ytdlPath}" --get-url --get-title --get-thumbnail --get-duration "${url}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) return res.json({ success: false, error: "Parse failed" });
      const lines = stdout.trim().split('\n');
      res.json({
        success: true,
        title: lines[0] || 'Video',
        thumbnail: lines[2] || '',
        duration: lines[3] || '0s',
      });
    });
  } catch (e) {
    res.json({ success: false, error: "Server error" });
  }
});

// 下载接口
app.get('/api/download', async (req, res) => {
  try {
    const url = req.query.url;
    const type = req.query.type;
    if (!url) return res.status(400).send("No URL");

    const ytdlPath = require('path').join(__dirname, '../node_modules/ytdl-core/bin/ytdl-core');
    let cmd;

    if (type === 'mp3') {
      cmd = `node "${ytdlPath}" -f bestaudio --audio-format mp3 -o - "${url}"`;
      res.setHeader('Content-Disposition', 'attachment; filename="video.mp3"');
      res.setHeader('Content-Type', 'audio/mpeg');
    } else {
      cmd = `node "${ytdlPath}" -f bestvideo+bestaudio --merge-output-format mp4 -o - "${url}"`;
      res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
      res.setHeader('Content-Type', 'video/mp4');
    }

    const ytdl = exec(cmd);
    ytdl.stdout.pipe(res);
    ytdl.stderr.on('data', () => {});
  } catch (e) {
    res.status(500).send("Download error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Started'));
