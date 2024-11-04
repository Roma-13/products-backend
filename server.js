const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;
const dataFilePath = path.join(__dirname, 'features.json');

app.use(cors());
app.use(bodyParser.json());

const loadFeatures = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([])); 
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Save features to JSON file
const saveFeatures = (features) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(features, null, 2));
};

// API Endpoints
app.post('/api/features', (req, res) => {
    const { screenSize, pii, batteryPowers } = req.body;
    if (!screenSize || !pii) {
        return res.status(400).json({ error: "Screen size and PII are required." });
    }

    const features = loadFeatures();
    const newFeature = { id: Date.now(), screenSize, pii, batteryPowers };
    features.push(newFeature);
    saveFeatures(features);
    res.status(201).json(newFeature);
});

app.get('/api/features', (req, res) => {
    const features = loadFeatures();
    res.json(features);
});

app.delete('/api/features/:id', (req, res) => {
    const features = loadFeatures();
    const updatedFeatures = features.filter(feature => feature.id !== parseInt(req.params.id));
    saveFeatures(updatedFeatures);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
