const rateLimitCache = {
  limits: {},

  // Cleanup old entries every minute
  init() {
    const CLEANUP_INTERVAL_IN_MS = 60 * 1000 // Preferably set in global config
    setInterval(() => this.cleanup(), CLEANUP_INTERVAL_IN_MS);
    return this;
  },

  cleanup() {
    const now = Date.now();
    Object.keys(this.limits).forEach(key => {
      const tenant = this.limits[key];
      // Remove if last request was more than 1 minutes ago
      const REQUEST_STORE_IN_MS = 60 * 1000 // Preferably set in global config
      if (now - tenant.lastRequest > REQUEST_STORE_IN_MS) {
        delete this.limits[key];
      }
    });
  },

  recordRequest(tenantId) {
    const now = Date.now();

    if (!this.limits[tenantId]) {
      this.limits[tenantId] = {
        requests: [now],
        lastRequest: now
      };
      return 1;
    }

    const tenant = this.limits[tenantId];
    const WINDOW_LENGTH_IN_MS = 60 * 1000; // 1 minute window length
    const windowStart = now - WINDOW_LENGTH_IN_MS;

    tenant.lastRequest = now;
    tenant.requests = tenant.requests.filter(time => time > windowStart);
    tenant.requests.push(now);

    return tenant.requests.length;
  }
}.init();

function rateLimiter(req, res, next) {
  // assume we don't need to tenantId any other way other than header of x-tenant-id
  const tenantId = req.headers["x-tenant-id"];

  if (!tenantId) {
    return res.status(400).json({
      error: "Missing tenant identifier",
      message: "Please provide a valid x-tenant-id header"
    });
  }

  const requestCount = rateLimitCache.recordRequest(tenantId);

  // Client can implement backoff and make cache decisions with the transparency
  res.setHeader('X-RateLimit-Limit', 100);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, 100 - requestCount));
  res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + 60 * 1000) / 1000));

  if (requestCount > 100) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "This tenant has exceeded the limit of 100 requests per minute"
    });
  }

  next();
}

module.exports = rateLimiter;