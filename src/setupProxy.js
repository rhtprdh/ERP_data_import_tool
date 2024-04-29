// src/setupProxy.js

import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://13.126.114.161:3000',
      changeOrigin: true,
      secure: false,
    })
  );
};
