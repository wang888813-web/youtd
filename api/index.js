const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ success: false, error: 'no url' });

  try {
    const { data } = await axios.post(
      'https://api.apify.com/v2/acts/streamers~youtube-video-downloader/run-sync-get-dataset-items',
      { videoUrl: url },
      { params: { token: 'apify_api_szxNc9j8t1TVNeXwgbxuzDb7HM28wg0OmuGR' } }
    );
    res.json(data[0]);
  } catch (e) {
    res.json({ success: false, error: 'failed' });
  }
};
