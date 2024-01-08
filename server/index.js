const express = require('express');
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require('./connect');
const URL = require('../server/models/url');

const app = express();

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

app.use(express.json());    

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    }
    );
    res.redirect(entry.redirectURL);
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});