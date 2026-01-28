const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Stripe Webhook Endpoint
router.post('/', webhookController.handleStripeWebhook);

module.exports = router;