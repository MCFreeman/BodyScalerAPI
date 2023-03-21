const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

function estimateBodyPartWeights(totalBodyWeight, weightUnit) {
    const weightUnitConversion = {
        kg: 1,
        g: 1000,
        mg: 1e6,
        cg: 1e5,
        hg: 10,
        dag: 100,
        lb: 2.20462,
        oz: 35.27396,
        stone: 0.157473,
        ton: 0.00110231,
        short_ton: 0.00110231,
        long_ton: 0.000984207,
        troy_ounce: 32.1507,
        troy_pound: 2.67923,
        carat: 5000,
        grain: 15432.4,
        dram: 564.383,
        pennyweight: 643.015,
    };

    if (!weightUnitConversion[weightUnit]) {
        throw new Error('Invalid weight unit');
    }

    totalBodyWeight = totalBodyWeight / weightUnitConversion[weightUnit];

    const bodyPartPercentages = {
        head_and_neck: 0.075,
        arms: 0.055,
        forearms: 0.018,
        hands: 0.007,
        upper_torso: 0.325,
        lower_torso: 0.325,
        thighs: 0.1,
        calves: 0.044,
        feet: 0.016
    };

    let bodyPartWeights = {};
    let totalEstimatedWeight = 0;

    for (const [bodyPart, percentage] of Object.entries(bodyPartPercentages)) {
        const weight = totalBodyWeight * percentage;
        bodyPartWeights[bodyPart] = parseFloat(weight.toFixed(2));
        totalEstimatedWeight += weight;
    }

    // Adjust the weights proportionally to match the entered total body weight
    const adjustmentFactor = totalBodyWeight / totalEstimatedWeight;

    for (const bodyPart in bodyPartWeights) {
        bodyPartWeights[bodyPart] *= adjustmentFactor;
    }

    return bodyPartWeights;
}

app.use(express.json());

app.post('/api/bodyweights', (req, res) => {
    const totalBodyWeight = parseFloat(req.body.totalBodyWeight);
    const weightUnit = req.body.weightUnit || 'kg';

    if (!totalBodyWeight) {
        return res.status(400).send('Invalid input. Please provide a total body weight.');
    }

    try {
        const bodyPartWeights = estimateBodyPartWeights(totalBodyWeight, weightUnit);
        res.json(bodyPartWeights);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
