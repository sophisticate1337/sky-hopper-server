const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const ScoreSchema = new mongoose.Schema({
    nickname: String,
    score: Number,
    timestamp: Number
});

const Score = mongoose.model('Score', ScoreSchema);

app.get('/leaderboard', async (req, res) => {
    const topScores = await Score.find().sort({ score: -1 }).limit(100);
    res.json(topScores);
});

app.post('/save-score', async (req, res) => {
    const { nickname, score, timestamp } = req.body;
    const newScore = new Score({ nickname, score, timestamp });
    await newScore.save();
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
