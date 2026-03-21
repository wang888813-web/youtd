Skip to content

wang888813-web
youtd

Type / to search



Repository navigation
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings

Files

 main


t
api
server.js
index.html
package.json
vercel.json
Editing server.js in youtd
Breadcrumbsyoutd/api
/

in
main
Cancel changes

Commit changes...

Edit

Preview

Indent mode

Indent size

Line wrap mode

Editing server.js file contents
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
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
Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
