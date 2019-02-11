const consola = require('consola')
const defaults = require('./defaults')
const MemoryStore = require('./memory')

module.exports = function RateLimit (_options) {
  const options = {
    ...defaults,
    ..._options
  }

  if (typeof options.handler === 'undefined') {
    options.handler = (req, res) => {
      const secondsLeft = Math.ceil((+req.rateLimit.resetTime - Date.now()) / 1000)
      res.statusCode = options.statusCode
      res.end(`Too many requests, please try again after ${secondsLeft} second${(secondsLeft > 1 ? 's' : '')}.`)
    }
  }

  if (typeof options.onLimitReached === 'undefined') {
    options.onLimitReached = (req) => {
      consola.warn('Too many requests in a short time detected for path: ' + req.url)
    }
  }

  // Store to use for persisting rate limit data
  options.store = options.store || new MemoryStore(options)

  return function rateLimit (req, res, next) {
    if (options.skip(req, res)) {
      return next()
    }

    if (req.ip === undefined) {
      req.ip = options.getIP(req)
    }

    const key = options.keyGenerator(req, res)

    options.store.increment(key, (err, current, resetTime) => {
      if (err) {
        return next(err)
      }

      req.rateLimit = {
        limit: options.max,
        current: current,
        remaining: Math.max(options.max - current, 0),
        resetTime
      }

      if (options.headers) {
        res.setHeader('X-RateLimit-Limit', req.rateLimit.limit)
        res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining)
        if (resetTime instanceof Date) {
          res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime.getTime() / 1000))
        }
      }

      if (options.skipFailedRequests || options.skipSuccessfulRequests) {
        let decremented = false
        const decrementKey = () => {
          if (!decremented) {
            options.store.decrement(key)
            decremented = true
          }
        }

        if (options.skipFailedRequests) {
          res.on('finish', function () {
            if (res.statusCode >= 400) {
              decrementKey()
            }
          })

          res.on('close', () => {
            if (!res.finished) {
              decrementKey()
            }
          })

          res.on('error', () => decrementKey())
        }

        if (options.skipSuccessfulRequests) {
          res.on('finish', function () {
            if (res.statusCode < 400) {
              decrementKey()
            }
          })
        }
      }

      if (options.max && current === options.max + 1) {
        options.onLimitReached(req, res, options)
      }

      if (options.max && current > options.max) {
        if (options.headers) {
          req.rateLimit.retryAfter = Math.ceil(options.windowMs / 1000)
          res.setHeader('Retry-After', req.rateLimit.retryAfter)
        }
        return options.handler(req, res, next)
      }

      next()
    })
  }
}
