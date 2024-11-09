const shortid = require("short-unique-id");
const URL = require('../models/url');

async function handleGenerateNewShortURL (req, res) {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    const uid = new shortid({ length: 8 });
    const short = uid.rnd();

    console.log("Generated short ID:", short); // Log the short ID for debugging

    try {
        const newUrl = await URL.create({
            shortId: short, 
            redirectURL: url,
            visitHistory: [],
        });

        return res.render("home", {
            id: short,
        });
    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetAnalytics (req,res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    })
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};
