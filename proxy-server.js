const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

const SMARTSUITE_TOKEN = 'f7b0e3b4331b7558ace016bc8891622dde922dc7';
const SMARTSUITE_WORKSPACE_ID = 'sfm1aa0l';
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
    const data = await response.json();

    console.log('[Proxy] Response:', response.status);
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[Proxy] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Proxy Server] Running on http://localhost:${PORT}`);
  console.log('[Proxy Server] Forwarding /api/smartsuite/* to SmartSuite API');
});
