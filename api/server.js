const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

// 获取视频信息接口
app.get('/api/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.json({ success: false, error: "Invalid YouTube URL" });
    }
    const info = await ytdl.getInfo(url);
    const details = info.videoDetails;
    res.json({
      success: true,
      title: details.title,
      thumbnail: details.thumbnails[details.thumbnails.length - 1].url,
      duration: details.lengthSeconds + 's',
      videoId: details.videoId
    });
  } catch (err) {
    res.json({ success: false, error: "Parsing failed, please try again" });
  }
});

// 下载接口
app.get('/api/download', async (req, res) => {
  try {
    const url = req.query.url;
    const type = req.query.type || 'mp4';
    const quality = req.query.quality || '720p';

    if (!ytdl.validateURL(url)) {
      return res.status(400).send("Invalid URL");
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[\/\\:*?"<>|]/g, '');

    let format;
    if (type === 'mp3') {
      format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
      res.setHeader('Content-Type', 'audio/mpeg');
    } else {
      format = ytdl.chooseFormat(info.formats, {
        quality: quality === '720p' ? '136' : '18',
        filter: 'videoandaudio'
      });
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
      res.setHeader('Content-Type', 'video/mp4');
    }

    ytdl(url, { format }).pipe(res);
  } catch (err) {
    res.status(500).send("Download failed, try another quality");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});