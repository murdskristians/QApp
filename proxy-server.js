const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

const SMARTSUITE_TOKEN = '72ea108a24f2c4dcae6724e4a25ef0d116f64a0e';
const SMARTSUITE_WORKSPACE_ID = 's1tfuose';
const SMARTSUITE_API_URL = 'https://app.smartsuite.com/api/v1';

app.use(cors());
app.use(express.json());

app.use('/api/smartsuite', async (req, res) => {
  const path = req.path || '/';
  const url = `${SMARTSUITE_API_URL}${path}`;

  console.log('[Proxy]', req.method, url);

  try {
    const options = {
      method: req.method,
      headers: {
        'Authorization': `Token ${SMARTSUITE_TOKEN}`,
        'Account-Id': SMARTSUITE_WORKSPACE_ID,
        'Content-Type': 'application/json',
      },
    };

    if (req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses (like rate limit text responses)
      const text = await response.text();

      if (response.status === 429 || text.toLowerCase().includes('too many requests')) {
        console.log('[Proxy] Rate limit exceeded');
        return res.status(429).json({
          message: 'Rate limit exceeded. Please wait a few minutes before making more requests.',
          status: 429
        });
      }

      data = { message: text };
    }

    console.log('[Proxy] Response:', response.status);
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[Proxy] Error:', error.message);

    // Check if it's a rate limit error
    if (error.message && error.message.toLowerCase().includes('too many requests')) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Please wait a few minutes before making more requests.',
        status: 429
      });
    }

    res.status(500).json({
      message: error.message || 'Internal server error',
      status: 500
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Proxy Server] Running on http://localhost:${PORT}`);
  console.log('[Proxy Server] Forwarding /api/smartsuite/* to SmartSuite API');
});
