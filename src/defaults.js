const getIP = require('./ip')

module.exports = {
  // How long to keep records of requests in memory (milliseconds)
  windowMs: 1000,

  // Max number of recent connections during `window` milliseconds before sending a 429 response
  max: 5,

  // 429 status = Too Many Requests (RFC 6585)
  statusCode: 429,

  // Send custom rate limit header with limit and remaining
  headers: true,

  // Do not count failed requests (status >= 400)
  skipFailedRequests: false,

  // Do not count successful requests (status < 400)
  skipSuccessfulRequests: false,

  // Allows to create custom keys
  keyGenerator: req => req.ip + '_' + req.url,

  // Allows to create custom request IP getter
  getIP: getIP,

  // Skip certain requests
  skip: () => false,

  // Handler in case of reate limits
  handler: undefined,

  // A custom callback when rate limit reached
  onLimitReached: undefined
}
