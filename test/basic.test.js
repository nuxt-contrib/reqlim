const connect = require('connect')
const Axios = require('axios')
const rateLimit = require('../src/middleware')
const MemoryStore = require('../src/memory')

describe('basic', () => {
  let app
  let server
  let axios
  let store

  it('init', () => {
    app = connect()

    store = new MemoryStore({ windowMs: 0 })
    app.use(rateLimit({
      store
    }))

    app.use('/target', (req, res) => { res.end('Target!') })
    app.use('/', (req, res) => { res.end('Works!') })

    server = app.listen(8080)

    axios = Axios.create({ baseURL: 'http://localhost:8080' })
  })

  it('/ (normal)', async () => {
    const response = await axios.get('/test')
    expect(response.data).toBe('Works!')
  })

  it('/target (burst)', async () => {
    const promises = []
    for (let i = 0; i < 100; i++) {
      promises.push(axios.get('/target').catch(e => e.response))
    }
    const responses = await Promise.all(promises)

    for (let i = 0; i < 5; i++) {
      expect(responses[i].data).toBe('Target!')
    }
    for (let i = 5; i < 100; i++) {
      expect(responses[i].data).toBe('Too many requests, please try again after 0 second.')
    }
  })

  it('close', () => {
    return new Promise(resolve => server.close(resolve))
  })
})
