const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const mongoose = require('mongoose');

// POST /api/alerts — create a new alert
router.post('/', async (req, res) => {
  try {
    const { productId, email, targetPrice } = req.body;
    if (!productId || !email || !targetPrice) {
      return res.status(400).json({ error: 'productId, email, and targetPrice are required' });
    }
    const alert = await Alert.create({ productId, email, targetPrice });
    res.status(201).json({ alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/alerts/:email — list all alerts for an email
router.get('/:email', async (req, res) => {
  try {
    const alerts = await Alert.find({ email: req.params.email })
      .populate('productId', 'name category brand')
      .sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/alerts/:id — delete an alert
router.delete('/:id', async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
