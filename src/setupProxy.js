const { createProxyMiddleware } = require('http-proxy-middleware');

const SMARTSUITE_TOKEN = '72ea108a24f2c4dcae6724e4a25ef0d116f64a0e';
const SMARTSUITE_WORKSPACE_ID = 's1tfuose';

module.exports = function(app) {
  app.use(
    '/api/smartsuite',
    createProxyMiddleware({
      target: 'https://app.smartsuite.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api/smartsuite': '/api/v1',
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy] Request:', req.method, req.url);
        proxyReq.setHeader('Authorization', `Token ${SMARTSUITE_TOKEN}`);
        proxyReq.setHeader('Account-Id', SMARTSUITE_WORKSPACE_ID);
        proxyReq.setHeader('Content-Type', 'application/json');
        console.log('[Proxy] Headers set - Token:', SMARTSUITE_TOKEN.substring(0, 10) + '...');
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('[Proxy] Response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('[Proxy] Error:', err.message);
      },
      logLevel: 'debug',
    })
  );
};
