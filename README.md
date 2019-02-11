# reqlim

> Connect/Express middleware to limit requests based on [express-rate-limit](https://github.com/nfriedly/express-rate-limit)

[![Standard JS][standard-src]][standard-href]
[![david dm][david-src]][david-href]
[![codecov][codecov-src]][codecov-href]
[![circleci][circleci-src]][circleci-href]

[![npm version][npm-v-src]][npm-v-href]
[![npm downloads][npm-dt-src]][npm-dt-href]
[![package phobia][packagephobia-src]][packagephobia-href]

## Usage

Install package:

```bash
npm install reqlim
```

OR

```bash
yarn add reqlim
```

Import and use middleware:

```js
const rateLimit = require('reqlim')

app.use(rateLimit())

```

## Options

### `windowMs`

- Default: `1000`

How long to keep records of requests in memory (milliseconds)

### `max`

- Default: `5`

Max number of recent connections during `window` milliseconds before sending a 429 response

### `statusCode`

- Default: `429`

Status when limit reached for Too Many Requests (RFC 6585)

### `headers`

- Default: `true`

Send custom rate limit header with limit and remaining

### `skipFailedRequests`

- Default: `false`

Do not count failed requests (status >= `400`)

### `skipSuccessfulRequests`

- Default: `false`

Do not count successful requests (status < `400`)

### `keyGenerator`

- Default: `req => req.ip + '_' + req.url`

Allows to create custom keys

### `getIP`

Allows to create custom request IP getter

### `skip`

- Default: `() => false`

Skip certain requests

### `handler`

Handler in case of reate limits

### `onLimitReached`

A custom callback when rate limit reached

## License

Based on https://github.com/nfriedly/express-rate-limit (MIT)

Made with 💖

<!-- Refs -->
[standard-src]: https://flat.badgen.net/badge/code%20style/standard/green
[standard-href]: https://standardjs.com

[npm-v-src]: https://flat.badgen.net/npm/v/reqlim/latest
[npm-v-href]: https://npmjs.com/package/reqlim

[npm-dt-src]: https://flat.badgen.net/npm/dt/reqlim
[npm-dt-href]: https://npmjs.com/package/reqlim

[packagephobia-src]: https://flat.badgen.net/packagephobia/install/reqlim
[packagephobia-href]: https://packagephobia.now.sh/result?p=reqlim

[david-src]: https://flat.badgen.net/david/dep/jsless/reqlim
[david-href]: https://david-dm.org/jsless/reqlim

[codecov-src]: https://flat.badgen.net/codecov/c/github/jsless/reqlim/master
[codecov-href]: https://codecov.io/gh/jsless/reqlim

[circleci-src]: https://flat.badgen.net/circleci/github/jsless/reqlim/master
[circleci-href]: https://circleci.com/gh/jsless/reqlim
