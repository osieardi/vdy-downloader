export default async function handler(req, res) {
    const { url } = req.query;
    if (!url || !url.includes('x.com') && !url.includes('twitter.com')) {
        return res.status(400).json({ success: false, error: 'Invalid X URL' });
    }

    try {
        // Convert to free FixTweet API
        const apiUrl = url.replace(/https?:\/\/(www\.)?(x|twitter)\.com\//i, 'https://api.fxtwitter.com/');

        const response = await fetch(apiUrl, {
            headers: { 'User-Agent': 'VideyDownloader/1.0 (free tool)' }
        });

        if (!response.ok) throw new Error('Tweet not accessible');

        const data = await response.json();
        const tweetText = data.tweet?.text || '';

        // Extract videy links
        const regex = /https?:\/\/cdn2\.(videy\.co|vldey\.cfd)[^\s"'<>()]+/gi;
        const links = tweetText.match(regex) || [];

        res.status(200).json({
            success: true,
            links: [...new Set(links)],
            text: tweetText
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}