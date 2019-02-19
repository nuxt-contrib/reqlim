const set = require('lodash/set')
const ip = require('../lib/ip')

const mockReq = () => ({
  headers: [],
  connection: {},
  socket: {}
})

describe('ip util', () => {
  it('Prefer req.ip', () => {
    const req = { ...mockReq(), ip: Math.random() }
    expect(ip(req)).toBe(req.ip)
  })

  // Prepare all keys
  const keys = [
    'headers.x-real-ip',
    'connection.remoteAddress',
    'socket.remoteAddress',
    'connection.socket.remoteAddress'
  ]

  const req = mockReq()

  for (const key of keys) {
    set(req, key, 'IP_FROM_' + key)
  }

  // Test order
  for (const key of keys) {
    it('Use ' + key, () => {
      expect(ip(req)).toBe('IP_FROM_' + key)
      set(req, key, undefined)
    })
  }
})
