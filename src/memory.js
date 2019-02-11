module.exports = class MemoryStore {
  constructor ({ windowMs } = {}) {
    this.windowMs = windowMs

    // Initial state
    this.resetAll()

    // Reset ALL hits every windowMs
    if (windowMs) {
      const interval = setInterval(() => this.resetAll(), windowMs)
      interval.unref()
    }
  }

  resetAll () {
    this.hits = {}

    // Calculate next reset time
    const d = new Date()
    d.setMilliseconds(d.getMilliseconds() + this.windowMs)
    this.resetTime = d
  }

  resetKey (key) {
    delete this.hits[key]
    delete this.resetTime[key]
  }

  increment (key, cb) {
    if (this.hits[key]) {
      this.hits[key]++
    } else {
      this.hits[key] = 1
    }

    cb(null, this.hits[key], this.resetTime)
  }

  decrement (key) {
    if (this.hits[key]) {
      this.hits[key]--
    }
  }
}
